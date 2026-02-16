from flask import Flask, render_template, jsonify
import random

# Pathing logic: Points back to root from the /api folder
app = Flask(__name__, template_folder='../templates', static_folder='../static')

TRACKS = {
    "electronic": [f"electronic_{i}.mp3" for i in range(1, 6)],
    "downtempo": [f"downtempo_{i}.mp3" for i in range(1, 6)],
    "classical": [f"classical_{i}.mp3" for i in range(1, 6)],
    "rain": [f"rain_{i}.mp3" for i in range(1, 6)]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tracks/<genre>')
def get_track(genre):
    if genre in TRACKS:
        return jsonify({"file": random.choice(TRACKS[genre])})
    return jsonify({"error": "Not found"}), 404

# Vercel requires this for serverless execution
app.debug = True
