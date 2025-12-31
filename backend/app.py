import os
from dotenv import load_dotenv

load_dotenv()
import smtplib
from email.message import EmailMessage
from typing import Dict, List, Optional

from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import JSON, Column, Integer, MetaData, String, Table, Text, create_engine, select, text as sql_text

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_TO = os.getenv("EMAIL_TO")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "true").lower() == "true"

# Single engine/metadata for Postgres
engine = create_engine(DATABASE_URL, future=True)
metadata = MetaData()

messages = Table(
  "messages",
  metadata,
  Column("id", Integer, primary_key=True),
  Column("name", String(255), nullable=False),
  Column("email", String(255), nullable=False),
  Column("message", Text, nullable=False),
  Column("created_at", String, server_default=sql_text("CURRENT_TIMESTAMP")),
)

education = Table(
  "education",
  metadata,
  Column("id", Integer, primary_key=True),
  Column("institution", String(255), nullable=False),
  Column("degree", String(255), nullable=False),
  Column("start_year", Integer),
  Column("end_year", Integer),
  Column("focus", String(255)),
  Column("location", String(255)),
  Column("order_index", Integer, server_default="0"),
)

projects = Table(
  "projects",
  metadata,
  Column("id", Integer, primary_key=True),
  Column("title", String(255), nullable=False),
  Column("summary", Text),
  Column("tags", JSON),
  Column("live_url", String(1024)),
  Column("code_url", String(1024)),
  Column("order_index", Integer, server_default="0"),
)

skills = Table(
  "skills",
  metadata,
  Column("id", Integer, primary_key=True),
  Column("category", String(255), nullable=False),
  Column("items", JSON),
  Column("order_index", Integer, server_default="0"),
)

certifications = Table(
  "certifications",
  metadata,
  Column("id", Integer, primary_key=True),
  Column("name", String(255), nullable=False),
  Column("provider", String(255)),
  Column("year", Integer),
  Column("details", Text),
  Column("order_index", Integer, server_default="0"),
)

social_links = Table(
  "social_links",
  metadata,
  Column("id", Integer, primary_key=True),
  Column("label", String(255), nullable=False),
  Column("url", String(1024), nullable=False),
  Column("icon", String(64)),
  Column("order_index", Integer, server_default="0"),
)


def init_db() -> None:
  metadata.create_all(engine)


def send_email(name: str, email: str, message: str) -> Optional[str]:
  if not (EMAIL_HOST and EMAIL_USER and EMAIL_PASSWORD and EMAIL_TO):
    return "Email credentials not configured; skipped sending"

  msg = EmailMessage()
  msg["Subject"] = "New portfolio contact"
  msg["From"] = EMAIL_USER
  msg["To"] = EMAIL_TO
  msg.set_content(f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}")

  try:
    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as smtp:
      if EMAIL_USE_TLS:
        smtp.starttls()
      smtp.login(EMAIL_USER, EMAIL_PASSWORD)
      smtp.send_message(msg)
    return None
  except Exception as exc:  # noqa: BLE001
    return str(exc)


def rows_for(table, order=None) -> List[Dict]:
  order = order or [table.c.order_index, table.c.id]
  with engine.connect() as conn:
    result = conn.execute(select(table).order_by(*order)).mappings().all()
  return [dict(row) for row in result]


def create_app() -> Flask:
  app = Flask(__name__)
  CORS(app)

  init_db()

  @app.get("/health")
  def health():
    return {"status": "ok"}

  @app.post("/api/contact")
  def contact():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or not email or not message:
      return jsonify({"message": "Name, email, and message are required."}), 400

    with engine.begin() as conn:
      conn.execute(
        messages.insert().values(name=name, email=email, message=message)
      )

    email_error = send_email(name, email, message)
    if email_error:
      return jsonify({"message": "Saved, email not sent", "email_error": email_error}), 202

    return jsonify({"message": "Saved and sent"}), 201

  @app.get("/api/education")
  def get_education():
    return jsonify(rows_for(education, [education.c.order_index, education.c.start_year.desc(), education.c.id]))

  @app.get("/api/projects")
  def get_projects():
    return jsonify(rows_for(projects))

  @app.get("/api/skills")
  def get_skills():
    return jsonify(rows_for(skills))

  @app.get("/api/certifications")
  def get_certifications():
    return jsonify(rows_for(certifications))

  @app.get("/api/social")
  def get_social():
    return jsonify(rows_for(social_links))

  return app

app = create_app()

if __name__ == "__main__":
  port = int(os.getenv("PORT", "8000"))
  debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
  app.run(host="0.0.0.0", port=port, debug=debug)
