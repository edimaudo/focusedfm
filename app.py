from flask import Flask, render_template

app = Flask(__name__)

# Updated Playlists with Royalty-Free Assets
PLAYLISTS = {
    "Rain": [
        {"name": "Heavy Rain & Thunder", "url": "https://archive.org/download/RelaxingRainAndLoudThunderFreeFieldRecordingOfNatureSoundsForSleepOrMeditation/Relaxing%20Rain%20And%20Loud%20Thunder.mp3"},
        {"name": "Soft Spring Rain", "url": "https://archive.org/download/spring-rain-loop/spring-rain-loop.mp3"},
        {"name": "Rain on Umbrella", "url": "https://archive.org/download/RainOnUmbrella/RainOnUmbrella.mp3"},
        {"name": "Distant Thunderstorm", "url": "https://archive.org/download/thunderstorm_202105/thunderstorm.mp3"},
        {"name": "Rainy Night Window", "url": "https://archive.org/download/rain-on-window-pane/rain-on-window-pane.mp3"}
    ],
    "Lofi": [
        {"name": "Calm Blue Lake", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Audionautix-com-ccby-calmbluelake.mp3"},
        {"name": "Emerald Therapy", "url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Audionautix-com-ccby-emeraldtherapy.mp3"},
        {"name": "Acoustic Shuffle", "url": "https://upload.wikimedia.org/wikipedia/commons/2/22/Audionautix-com-ccby-acousticshuffle.mp3"},
        {"name": "Clouds", "url": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Audionautix-com-ccby-clouds.mp3"},
        {"name": "Morning Coffee", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Audionautix-com-ccby-coldmorning.mp3"}
    ],
    "Nature": [
        {"name": "Morning Birdsong", "url": "https://archive.org/download/bird-singing-at-5am/bird-singing.mp3"},
        {"name": "Ocean Waves", "url": "https://archive.org/download/ocean-waves-01/ocean-waves.mp3"},
        {"name": "Deep Forest Ambience", "url": "https://archive.org/download/forest-ambience-01/forest-ambience.mp3"},
        {"name": "Wind in the Pines", "url": "https://archive.org/download/wind-in-trees-loop/wind-trees.mp3"},
        {"name": "Mountain Stream", "url": "https://archive.org/download/mountain-stream-sound/stream.mp3"}
    ],
    "Electronic": [
        {"name": "Algorithm", "url": "https://upload.wikimedia.org/wikipedia/commons/3/30/Audionautix-com-ccby-algorithm.mp3"},
        {"name": "Deep Space", "url": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Audionautix-com-ccby-deepspace.mp3"},
        {"name": "System Breach", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Audionautix-com-ccby-codeblue.mp3"},
        {"name": "Alien Sunset", "url": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Audionautix-com-ccby-aliensunset.mp3"},
        {"name": "Antarctica", "url": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Audionautix-com-ccby-antarctica.mp3"}
    ],
    "Trip-hop": [
        {"name": "Nocturnal Haze", "url": "https://archive.org/download/triphop-instrumental-01/nocturnal.mp3"},
        {"name": "Urban Echo", "url": "https://archive.org/download/chill-trip-hop-beat/urban-echo.mp3"},
        {"name": "Shadow Chant", "url": "https://archive.org/download/trip-hop-shadows/shadow-chant.mp3"},
        {"name": "Midnight Groove", "url": "https://archive.org/download/downtempo-trip-hop-05/midnight.mp3"},
        {"name": "Distant Pulse", "url": "https://archive.org/download/industrial-triphop/pulse.mp3"}
    ],
    "Gregorian Chant": [
        {"name": "Cum Angelis", "url": "https://archive.org/download/gregorian-chant-collection/CumAngelis.mp3"},
        {"name": "Kyrie Eleison", "url": "https://archive.org/download/gregorian-chants/Kyrie.mp3"},
        {"name": "Gloria in Excelsis", "url": "https://archive.org/download/monks-chanting/Gloria.mp3"},
        {"name": "Salve Regina", "url": "https://archive.org/download/medieval-chants/SalveRegina.mp3"},
        {"name": "Veni Creator Spiritus", "url": "https://archive.org/download/sacred-chants/VeniCreator.mp3"}
    ]
}

@app.route('/')
def index():
    return render_template('index.html', playlists=PLAYLISTS)

if __name__ == '__main__':
    app.run(debug=True)
