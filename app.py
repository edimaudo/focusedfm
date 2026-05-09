from flask import Flask, render_template, jsonify

app = Flask(__name__)

TRACKS = {
    "rain": [
        {"id": 1, "title": "Morning Drizzle",        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
        {"id": 2, "title": "Storm Front",             "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
        {"id": 3, "title": "Gentle Patter",           "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"},
        {"id": 4, "title": "Thunderstorm Lullaby",    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"},
        {"id": 5, "title": "Urban Rain",              "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"},
    ],
    "lofi": [
        {"id": 1, "title": "Late Night Study",        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"},
        {"id": 2, "title": "Coffee Shop",             "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"},
        {"id": 3, "title": "Rainy Afternoon",         "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"},
        {"id": 4, "title": "Midnight Oil",            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"},
        {"id": 5, "title": "Dorm Room Beats",         "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"},
    ],
    "nature": [
        {"id": 1, "title": "Forest Walk",             "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3"},
        {"id": 2, "title": "Mountain Stream",         "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"},
        {"id": 3, "title": "Ocean Breeze",            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3"},
        {"id": 4, "title": "Birdsong at Dawn",        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3"},
        {"id": 5, "title": "Evening Crickets",        "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"},
    ],
    "electronic": [
        {"id": 1, "title": "Pulse",                   "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"},
        {"id": 2, "title": "Grid",                    "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3"},
        {"id": 3, "title": "Neon Signal",             "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"},
        {"id": 4, "title": "Deep Orbit",              "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"},
        {"id": 5, "title": "Synthetic Dawn",          "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"},
    ],
    "triphop": [
        {"id": 1, "title": "Shadow Walk",             "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"},
        {"id": 2, "title": "Smoked Glass",            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"},
        {"id": 3, "title": "Broken Clocks",           "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"},
        {"id": 4, "title": "Underground",             "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"},
        {"id": 5, "title": "Slow Burn",               "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"},
    ],
    "gregorian": [
        {"id": 1, "title": "Kyrie Eleison",           "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"},
        {"id": 2, "title": "Agnus Dei",               "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"},
        {"id": 3, "title": "Gloria in Excelsis",      "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3"},
        {"id": 4, "title": "Sanctus",                 "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"},
        {"id": 5, "title": "Benedictus",              "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3"},
    ],
}

GENRE_META = {
    "rain":       {"label": "Rain"},
    "lofi":       {"label": "Lo-Fi"},
    "nature":     {"label": "Nature"},
    "electronic": {"label": "Electronic"},
    "triphop":    {"label": "Trip-Hop"},
    "gregorian":  {"label": "Gregorian Chant"},
}

@app.route("/")
def index():
    return render_template("index.html", tracks=TRACKS, genre_meta=GENRE_META)


if __name__ == "__main__":
    app.run(debug=True)
