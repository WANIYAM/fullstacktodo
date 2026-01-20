import os
from google import genai
from google.genai import types
import json

# Initialize client once
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_task_intent(user_input: str) -> dict:
    prompt = f"""You are an intent classifier for a Todo application.

Context:
- The user is authenticated
- The user owns tasks
- You DO NOT access the database
- You ONLY classify intent

Allowed actions:
- create
- update
- list

Rules:
- Do not invent task IDs
- Do not add extra fields
- Do not explain anything
- Respond ONLY in valid JSON

JSON schema:
{{
  "action": "create | update | list",
  "title": "string | null",
  "completed": true | false | null
}}

User input: {user_input}"""

    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=prompt
        )
        
        text = response.text.strip()
        
        # Remove markdown code blocks if present
        if text.startswith("```"):
            lines = text.split("\n")
            text = "\n".join(lines[1:-1])
        
        return json.loads(text)
    except Exception as e:
        print(f"Error in get_task_intent: {e}")
        return {
            "action": "list",
            "title": None,
            "completed": None,
        }