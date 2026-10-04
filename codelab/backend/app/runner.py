"""
Runs user code securely inside an isolated Docker container.
"""
import subprocess

TIMEOUT_SECONDS = 5

def run_python(code: str, stdin: str) -> tuple[str, str]:
    command = [
        "docker", "run",
        "--rm",               # Remove container after run
        "-i",                 # Keep STDIN open for test inputs
        "--net", "none",      # Disable networking
        "--memory", "128m",   # Limit RAM to 128MB
        "--cpus", "0.5",      # Limit CPU usage
        "python:3.11-slim",   # The image we just downloaded
        "python", "-c", code
    ]

    try:
        proc = subprocess.run(
            command,
            input=stdin,
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS,
        )
        return proc.stdout.strip(), proc.stderr.strip()
    except subprocess.TimeoutExpired:
        return "", f"Time limit exceeded ({TIMEOUT_SECONDS}s)"