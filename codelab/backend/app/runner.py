"""
Runs user code against test cases.

WARNING: this uses a plain subprocess with a timeout. It is fine for local
development only. Before going public, run code in a sandbox instead
(Docker with no network + memory/CPU limits, Judge0, or Piston).
"""
import subprocess
import sys
import tempfile
from pathlib import Path

TIMEOUT_SECONDS = 5


def run_python(code: str, stdin: str) -> tuple[str, str]:
    with tempfile.TemporaryDirectory() as tmp:
        script = Path(tmp) / "main.py"
        script.write_text(code)
        try:
            proc = subprocess.run(
                [sys.executable, "-I", str(script)],
                input=stdin,
                capture_output=True,
                text=True,
                timeout=TIMEOUT_SECONDS,
                cwd=tmp,
            )
            return proc.stdout.strip(), proc.stderr.strip()
        except subprocess.TimeoutExpired:
            return "", f"Time limit exceeded ({TIMEOUT_SECONDS}s)"
