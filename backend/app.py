import os
from dotenv import load_dotenv

load_dotenv()
import smtplib
from email.message import EmailMessage
from typing import Dict, List, Optional

import json
from functools import wraps
from flask import Flask, jsonify, request, render_template, redirect, url_for, session, flash

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
  Column("image", Text),
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

users = Table(
  "users",
  metadata,
  Column("id", Integer, primary_key=True),
  Column("username", String(255), unique=True, nullable=False),
  Column("password", String(255), nullable=False),
)

profile = Table(
  "profile",
  metadata,
  Column("id", Integer, primary_key=True),
  Column("resume_data", Text),
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

  app.secret_key = os.getenv("SECRET_KEY", "supersecretkey")

  @app.route('/')
  def index():
      return redirect(url_for('login'))

  def login_required(f):
      @wraps(f)
      def decorated_function(*args, **kwargs):
          if not session.get('logged_in'):
              return redirect(url_for('login', next=request.url))
          return f(*args, **kwargs)
      return decorated_function

  @app.route('/admin/login', methods=['GET', 'POST'])
  def login():
      if request.method == 'POST':
          username = request.form['username']
          password = request.form['password']
          
          with engine.connect() as conn:
              user = conn.execute(select(users).where(users.c.username == username)).mappings().first()
          
          if user and user.password == password:
              session['logged_in'] = True
              return redirect(url_for('admin_dashboard'))
          flash('Invalid username or password')
      return render_template('login.html')

  @app.route('/admin/logout')
  def logout():
      session.pop('logged_in', None)
      return redirect(url_for('login'))

  @app.route('/admin')
  @login_required
  def admin_dashboard():
      return render_template('dashboard.html')

  tables = {
      'education': education,
      'projects': projects,
      'skills': skills,
      'certifications': certifications,
      'social_links': social_links,
      'messages': messages,
      'profile': profile
  }

  @app.route('/admin/<table_name>')
  @login_required
  def admin_table(table_name):
      if table_name not in tables:
          return "Table not found", 404
      
      table = tables[table_name]
      columns = [c.name for c in table.columns]
      
      with engine.connect() as conn:
          result = conn.execute(select(table).order_by(table.c.id.desc())).mappings().all()
      
      return render_template('table.html', table_name=table_name, columns=columns, rows=result)

  @app.route('/admin/<table_name>/add', methods=['GET', 'POST'])
  @login_required
  def admin_add(table_name):
      if table_name not in tables:
          return "Table not found", 404
      
      table = tables[table_name]
      columns = [c.name for c in table.columns]
      
      if request.method == 'POST':
          data = {}
          for col in columns:
              if col in request.form and col != 'id' and col != 'created_at':
                  val = request.form[col]
                  if col in ['items', 'tags']:
                      val = [x.strip() for x in val.split(',') if x.strip()] if val else []
                  
                  if table.columns[col].type.python_type == int and val:
                      val = int(val)
                  
                  data[col] = val
          
          with engine.begin() as conn:
              conn.execute(table.insert().values(**data))
          
          flash('Added successfully')
          return redirect(url_for('admin_table', table_name=table_name))

      return render_template('form.html', table_name=table_name, columns=columns, row=None, action="Add")

  @app.route('/admin/<table_name>/edit/<int:id>', methods=['GET', 'POST'])
  @login_required
  def admin_edit(table_name, id):
      if table_name not in tables:
          return "Table not found", 404
      
      table = tables[table_name]
      columns = [c.name for c in table.columns]
      
      with engine.connect() as conn:
          row = conn.execute(select(table).where(table.c.id == id)).mappings().first()
      
      if not row:
          return "Row not found", 404

      if request.method == 'POST':
          data = {}
          for col in columns:
              if col in request.form and col != 'id' and col != 'created_at':
                  val = request.form[col]
                  if col in ['items', 'tags']:
                      val = [x.strip() for x in val.split(',') if x.strip()] if val else []
                  
                  if table.columns[col].type.python_type == int and val:
                      val = int(val)
                  
                  data[col] = val
          
          with engine.begin() as conn:
              conn.execute(table.update().where(table.c.id == id).values(**data))
          
          flash('Updated successfully')
          return redirect(url_for('admin_table', table_name=table_name))

      return render_template('form.html', table_name=table_name, columns=columns, row=row, action="Edit")

  @app.route('/admin/<table_name>/delete/<int:id>', methods=['POST'])
  @login_required
  def admin_delete(table_name, id):
      if table_name not in tables:
          return "Table not found", 404
      
      table = tables[table_name]
      with engine.begin() as conn:
          conn.execute(table.delete().where(table.c.id == id))
      
      flash('Deleted successfully')
      return redirect(url_for('admin_table', table_name=table_name))

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

  @app.get("/api/profile")
  def get_profile():
    with engine.connect() as conn:
      row = conn.execute(select(profile)).mappings().first()
    return jsonify(dict(row) if row else {})

  return app

app = create_app()

if __name__ == "__main__":
  port = int(os.getenv("PORT", "8000"))
  debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
  app.run(host="0.0.0.0", port=port, debug=debug)
