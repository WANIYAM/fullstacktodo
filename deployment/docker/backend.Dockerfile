# Stage 1: Builder
FROM python:3.13-slim AS builder

WORKDIR /app

# Install uv
RUN pip install uv

# Copy requirements.txt from the backend directory
COPY backend/requirements.txt .

# Install Python dependencies using uv
RUN uv pip install -r requirements.txt

# Copy the rest of the backend application code
COPY backend .

# Stage 2: Runner
FROM python:3.13-slim AS runner

WORKDIR /app

# Copy only necessary runtime dependencies from builder
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin/uv /usr/local/bin/uv

# Create a non-root user
RUN adduser --system --group appuser
USER appuser

# Copy application code
COPY --from=builder /app .

# Expose the port FastAPI listens on
EXPOSE 8000

# Command to run the FastAPI application using Uvicorn
# Assuming your main FastAPI app instance is named 'app' in 'main.py'
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
