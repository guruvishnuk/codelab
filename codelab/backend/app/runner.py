"""
Runs user code securely inside an isolated Docker container with local fallback.
"""
import os
import sys
import subprocess

TIMEOUT_SECONDS = 5

def _run_local(code: str, stdin: str) -> tuple[str, str]:
    try:
        proc = subprocess.run(
            [sys.executable, "-c", code],
            input=stdin,
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS,
        )
        return proc.stdout.strip(), proc.stderr.strip()
    except subprocess.TimeoutExpired:
        return "", f"Time limit exceeded ({TIMEOUT_SECONDS}s)"

def run_python(code: str, stdin: str) -> tuple[str, str]:
    use_docker = os.getenv("USE_DOCKER_SANDBOX", "true").lower() in ("true", "1")

    if use_docker:
        command = [
            "docker", "run",
            "--rm",               # Remove container after run
            "-i",                 # Keep STDIN open for test inputs
            "--net", "none",      # Disable networking
            "--memory", "128m",   # Limit RAM to 128MB
            "--cpus", "0.5",      # Limit CPU usage
            "python:3.11-slim",
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
            # If docker failed because the daemon isn't running or docker is not found, fallback to local dev runner
            stderr_lower = proc.stderr.lower()
            if proc.returncode != 0 and any(err_sig in stderr_lower for err_sig in ("docker desktop", "daemon", "pipe", "npipe", "cannot find the file specified", "docker: not found")):
                return _run_local(code, stdin)
            return proc.stdout.strip(), proc.stderr.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
            return _run_local(code, stdin)
    else:
        return _run_local(code, stdin)