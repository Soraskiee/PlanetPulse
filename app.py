from flask import Flask, render_template, request, jsonify
import sqlite3
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "planetpulse.db"

app = Flask(__name__, template_folder=str(BASE_DIR), static_folder=str(BASE_DIR), static_url_path="/static")

EMISSION_FACTORS = {
    "car": 0.20,
    "bus": 0.08,
    "flight": 0.25,
    "electricity": 0.80,
    "veg": 0.5,
    "nonveg": 2.0,
}

VALID_TYPES = set(EMISSION_FACTORS)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id TEXT NOT NULL,
                type TEXT NOT NULL,
                quantity REAL NOT NULL,
                emission REAL NOT NULL,
                date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/activities", methods=["GET"])
def get_activities():
    client_id = request.args.get("client_id", "").strip()
    if not client_id:
        return jsonify([])

    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, type, quantity, emission, date
            FROM activities
            WHERE client_id = ?
            ORDER BY date DESC, id DESC
            """,
            (client_id,),
        ).fetchall()

    return jsonify([dict(row) for row in rows])


@app.route("/api/activities", methods=["POST"])
def add_activity():
    data = request.get_json(silent=True) or {}
    client_id = str(data.get("client_id", "")).strip()
    activity_type = str(data.get("type", "")).strip()

    try:
        quantity = float(data.get("quantity"))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid quantity"}), 400

    if not client_id:
        return jsonify({"error": "Missing client_id"}), 400
    if activity_type not in VALID_TYPES:
        return jsonify({"error": "Invalid activity type"}), 400
    if quantity <= 0:
        return jsonify({"error": "Quantity must be greater than zero"}), 400

    max_values = {
        "car": 10000,
        "bus": 10000,
        "flight": 30000,
        "electricity": 10000,
        "veg": 100,
        "nonveg": 100,
    }

    if quantity > max_values[activity_type]:
        return jsonify({"error": "Quantity is above the allowed limit"}), 400

    # Use India local time instead of SQLite's UTC CURRENT_TIMESTAMP.
    # This keeps activity dates aligned with the user's local calendar day.
    activity_date = datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%Y-%m-%d %H:%M:%S")

    emission = quantity * EMISSION_FACTORS[activity_type]

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO activities (client_id, type, quantity, emission, date)
            VALUES (?, ?, ?, ?, ?)
            """,
            (client_id, activity_type, quantity, emission, activity_date),
        )
        conn.commit()
        activity_id = cursor.lastrowid

    return jsonify(
        {
            "id": activity_id,
            "type": activity_type,
            "quantity": quantity,
            "emission": emission,
        }
    ), 201


init_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
