import html
import logging
import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("codelab.email")


def is_smtp_configured() -> bool:
    """Return True when all required SMTP credentials are present in the environment."""
    return bool(
        os.getenv("SMTP_HOST", "").strip()
        and os.getenv("SMTP_USER", "").strip()
        and os.getenv("SMTP_PASSWORD", "").strip()
    )


def build_welcome_email(
    to_email: str,
    name: str,
    provider: str = "oauth",
) -> MIMEMultipart:
    """Construct a multipart plain-text + HTML Welcome to CodeLab email message."""
    display_name = (name or "").strip() or "Coder"
    first_name = display_name.split()[0]
    safe_name = html.escape(display_name)
    safe_provider = html.escape((provider or "oauth").capitalize())

    app_url = os.getenv("APP_URL", "https://codelab-amber.vercel.app").rstrip("/")
    from_addr = (
        os.getenv("EMAIL_FROM", "").strip()
        or os.getenv("SMTP_USER", "").strip()
        or "CodeLab <no-reply@codelab.dev>"
    )

    subject = f"Welcome to CodeLab, {first_name}!"

    plain_text = (
        f"Welcome to CodeLab, {display_name}!\n\n"
        "Your account is ready — we're excited to have you start coding with us.\n\n"
        "Here is what you can jump into right away:\n"
        "  - 6 interactive Python curriculum tracks (from Basics to Dictionaries & Sets)\n"
        "  - In-browser CodeMirror playground with custom testcases & live diff history\n"
        "  - XP rewards, daily coding streaks, and unlockable achievement badges\n\n"
        f"Start coding now: {app_url}/topics/python-basics\n"
        f"View your dashboard: {app_url}/dashboard\n\n"
        f"Signed in with: {provider or 'oauth'}\n"
        "— The CodeLab Team\n"
    )

    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to CodeLab</title>
</head>
<body style="margin:0;padding:0;background-color:#070b14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#070b14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#0f172a 0%,#132a3a 100%);border-bottom:1px solid #1e293b;">
              <div style="font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#f8fafc;">
                <span style="color:#00dfa2;">&lt;/&gt;</span> CodeLab
              </div>
              <div style="margin-top:6px;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#38bdf8;">
                Interactive Python Learning Platform
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#ffffff;">
                Welcome to CodeLab, {safe_name}!
              </h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#cbd5e1;">
                Your account is all set up and ready to go. Dive into bite-sized concept notes, run Python right in your browser, and level up your skills with automated tests.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b1120;border:1px solid #1e293b;border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:18px 20px;font-size:14px;line-height:1.7;color:#cbd5e1;">
                    <div style="margin-bottom:8px;"><strong style="color:#00dfa2;">&#9656; Interactive Tracks:</strong> 6 curated Python modules from fundamentals to hash maps.</div>
                    <div style="margin-bottom:8px;"><strong style="color:#38bdf8;">&#9656; Pro Playground:</strong> Instant test evaluation, custom stdin sandbox, and submission diffs.</div>
                    <div><strong style="color:#c084fc;">&#9656; Progress &amp; Ranks:</strong> Earn XP, keep your daily streak alive, and unlock badges.</div>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 20px;">
                <tr>
                  <td style="border-radius:10px;background-color:#00dfa2;">
                    <a href="{app_url}/topics/python-basics" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;color:#04131c;text-decoration:none;">
                      Start Coding Now &rarr;
                    </a>
                  </td>
                  <td style="width:12px;"></td>
                  <td style="border-radius:10px;border:1px solid #334155;">
                    <a href="{app_url}/dashboard" style="display:inline-block;padding:12px 20px;font-size:14px;font-weight:500;color:#e2e8f0;text-decoration:none;">
                      Open Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#94a3b8;">
                Signed in via <strong style="color:#e2e8f0;">{safe_provider}</strong>. Happy coding!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background-color:#0b1120;border-top:1px solid #1e293b;font-size:12px;color:#64748b;">
              You received this email because you signed in to CodeLab ({app_url}).
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_email
    msg.attach(MIMEText(plain_text, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))
    return msg


def send_welcome_email(
    to_email: str,
    name: str,
    provider: str = "oauth",
) -> dict:
    """
    Send a Welcome to CodeLab email to the user.

    - When SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are configured, delivers via SMTP
      (STARTTLS on port 587 by default, or SSL on port 465 / SMTP_USE_SSL=true).
    - Otherwise, logs the generated email in console/dev mode so local setups never fail.
    """
    msg = build_welcome_email(to_email=to_email, name=name, provider=provider)

    if not is_smtp_configured():
        logger.info(
            "[CodeLab Email - Console Mode] To: %s | Subject: %s | Provider: %s",
            to_email,
            msg["Subject"],
            provider,
        )
        print(
            f"\n{'=' * 60}\n"
            f"[CodeLab Email - Console Mode (SMTP not configured)]\n"
            f"From:    {msg['From']}\n"
            f"To:      {to_email}\n"
            f"Subject: {msg['Subject']}\n"
            f"{'=' * 60}\n"
        )
        return {"delivered": True, "mode": "console", "recipient": to_email}

    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    use_ssl = os.getenv("SMTP_USE_SSL", "false").strip().lower() == "true" or smtp_port == 465

    try:
        context = ssl.create_default_context()
        if use_ssl:
            with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10, context=context) as server:
                server.login(smtp_user, smtp_password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)

        logger.info("Sent welcome email via SMTP to %s", to_email)
        return {"delivered": True, "mode": "smtp", "recipient": to_email}
    except Exception as exc:
        logger.error("Failed to send welcome email to %s: %s", to_email, exc)
        return {"delivered": False, "mode": "smtp_error", "recipient": to_email, "error": str(exc)}
