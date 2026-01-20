from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from google import genai
from google.genai import types
import os
import json

from .. import auth, crud, models, schemas
from ..database import get_session

router = APIRouter(prefix="/ai", tags=["ai"])

# Configure Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def classify_intent(user_input: str, existing_tasks: List[models.Task]) -> dict:
    """Use Gemini to classify user intent and extract parameters"""
    
    # FIXED: Changed is_completed to completed
    tasks_context = "\n".join([
        f"- ID: {task.id}, Title: {task.title}, Completed: {task.completed}"
        for task in existing_tasks
    ]) if existing_tasks else "No existing tasks"
    
    prompt = f"""You are a task management assistant. Analyze the user's request and determine the intent.

User's existing tasks:
{tasks_context}

User request: "{user_input}"

Respond ONLY with a JSON object in this exact format:
{{
  "intent": "create" | "update" | "list" | "delete",
  "task_id": <number or null>,
  "title": "<string or null>",
  "description": "<string or null>",
  "completed": <boolean or null>
}}

Rules:
- For "create": extract title and description from request
- For "update": identify task_id from context, extract fields to update
- For "list": return intent only
- For "delete": identify task_id from context
- If task reference is ambiguous, use the first matching task
- For completion requests, set completed to true
- Return null for fields that aren't specified or needed"""

    try:
        response = client.models.generate_content(
            model='gemini-1.5-flash',  # Changed to stable model with better quota
            contents=prompt
        )
        result_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if result_text.startswith("```"):
            lines = result_text.split("\n")
            result_text = "\n".join(lines[1:-1])
        
        return json.loads(result_text)
    except Exception as e:
        print(f"AI processing error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI processing failed: {str(e)}"
        )

@router.post("/tasks", response_model=schemas.AITaskResponse)
def process_ai_task(
    request: schemas.AITaskRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_session)
):
    """Process natural language task request using AI"""
    
    try:
        # Get user's existing tasks for context
        existing_tasks = crud.get_tasks_by_user(db, user_id=current_user.id)
        
        # Classify intent using AI
        intent_data = classify_intent(request.input, existing_tasks)
        
        intent = intent_data.get("intent")
        
        if intent == "create":
            if not intent_data.get("title"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not extract task title from input"
                )
            
            task_create = schemas.TaskCreate(
                title=intent_data["title"],
                description=intent_data.get("description", "")
            )
            result = crud.create_user_task(db, task=task_create, user_id=current_user.id)
            
            return schemas.AITaskResponse(
                action="created",
                task=result,
                message=f"Created task: {result.title}"
            )
        
        elif intent == "update":
            task_id = intent_data.get("task_id")
            if not task_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not identify which task to update"
                )
            
            # FIXED: Changed is_completed to completed
            task_update = schemas.TaskUpdate(
                title=intent_data.get("title"),
                description=intent_data.get("description"),
                completed=intent_data.get("completed")
            )
            
            result = crud.update_task(db, task_id=task_id, task_update=task_update, user_id=current_user.id)
            if not result:
                raise HTTPException(status_code=404, detail="Task not found")
            
            return schemas.AITaskResponse(
                action="updated",
                task=result,
                message=f"Updated task: {result.title}"
            )
        
        elif intent == "list":
            tasks = crud.get_tasks_by_user(db, user_id=current_user.id)
            
            return schemas.AITaskResponse(
                action="listed",
                tasks=tasks,
                message=f"Found {len(tasks)} task(s)"
            )
        
        elif intent == "delete":
            task_id = intent_data.get("task_id")
            if not task_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Could not identify which task to delete"
                )
            
            result = crud.delete_task(db, task_id=task_id, user_id=current_user.id)
            if not result:
                raise HTTPException(status_code=404, detail="Task not found")
            
            return schemas.AITaskResponse(
                action="deleted",
                task=result,
                message=f"Deleted task: {result.title}"
            )
        
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not understand the request"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in process_ai_task: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )