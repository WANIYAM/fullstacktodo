FROM python:3.13-slim

WORKDIR /app

# Install uv
RUN pip install uv --break-system-packages

# Copy requirements
COPY backend/requirements.txt .

# Install dependencies
RUN uv pip install --system -r requirements.txt

# Copy application code
COPY backend .

# Create non-root user
RUN adduser --system --group appuser && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Run with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]