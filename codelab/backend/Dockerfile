FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set env variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (needed for compiling some python packages if needed)
RUN apt-get update \
    && apt-get install -y gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose port (Render/Fly often use PORT environment variable)
ENV PORT=8000
EXPOSE 8000

# Start the application
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
