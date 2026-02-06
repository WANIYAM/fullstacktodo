# Stage 1: Build Stage
FROM python:3.10-slim-buster AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

# Copy only requirements.txt to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime Stage
FROM python:3.10-slim-buster AS runner

WORKDIR /app

# Copy only necessary runtime dependencies from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin/uvicorn /usr/local/bin/uvicorn

# Create a non-root user
RUN adduser --system --group appuser
USER appuser

# Copy application code
COPY . .

# Expose the port FastAPI listens on
EXPOSE 8000

# Command to run the FastAPI application using Uvicorn
# Assuming your main FastAPI app instance is named 'app' in 'main.py'
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
