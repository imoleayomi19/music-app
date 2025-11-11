import { useEffect, useState, useRef } from "react";
import { Play, Pause, Search, Volume2, Heart, SkipBack, SkipForward } from "lucide-react";
import "../components/App.css";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liked, setLiked] = useState(new Set());
  const [sortBy, setSortBy] = useState("title");
  const audioRef = useRef(null);

  useEffect(() => {
    fetch("https://robo-music-api.onrender.com/music/my-api")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSongs(data || []);
      })
      .catch((err) => {
        console.error("Error fetching music:", err);
        setError("Failed to load songs. Please try again later.");
      });
  }, []);

  useEffect(() => {
    if (!audio) return;
    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration);
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [audio]);

  const playSong = (url, id) => {
    if (playing === id) {
      if (audio) {
        audio.pause();
        setPlaying(null);
      }
    } else {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      const newAudio = new Audio(url);
      newAudio.volume = volume;
      audioRef.current = newAudio;

      newAudio
        .play()
        .then(() => {
          setAudio(newAudio);
          setPlaying(id);
        })
        .catch((error) => console.error("Error playing audio:", error));

      newAudio.onended = () => {
        setPlaying(null);
        setProgress(0);
      };
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audio) audio.volume = vol;
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audio) {
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const toggleLike = (id) => {
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredSongs = songs
    .filter((song) =>
      `${song.songTitle} ${song.artistName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.songTitle.localeCompare(b.songTitle);
      } else if (sortBy === "artist") {
        return a.artistName.localeCompare(b.artistName);
      }
      return 0;
    });

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title"> TuneTrail</h1>
        <p className="app-subtitle">Your Music, Your Way</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {playing && audio && (
        <div className="now-playing">
          <div className="now-playing-content">
            <p className="now-playing-label">Now Playing</p>
            <div className="progress-container">
              <span className="time">{formatTime(progress)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleProgressChange}
                className="progress-bar"
              />
              <span className="time">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="music-app">
        <div className="controls-section">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="controls-row">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="title">Sort by Title</option>
              <option value="artist">Sort by Artist</option>
            </select>

            <div className="volume-control">
              <Volume2 size={18} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
              <span className="volume-label">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="playlist-header">
          <h2 className="playlist-title">
            Playlist ({filteredSongs.length} songs)
          </h2>
        </div>

        <div className="songs-grid">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <div
                key={song.id}
                className={`song-card ${
                  playing === song.id ? "playing" : ""
                }`}
              >
                <div className="song-content">
                  <div className="song-info">
                    <h3 className="song-title">{song.songTitle}</h3>
                    <p className="song-artist">{song.artistName}</p>
                  </div>
                  <button
                    className={`like-button ${liked.has(song.id) ? "liked" : ""}`}
                    onClick={() => toggleLike(song.id)}
                    aria-label="Toggle like"
                  >
                    <Heart
                      size={18}
                      fill={liked.has(song.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <div className="song-controls">
                  <button
                    onClick={() => playSong(song.songUrl, song.id)}
                    className={`play-button ${
                      playing === song.id ? "playing" : ""
                    }`}
                    aria-label={
                      playing === song.id ? "Pause song" : "Play song"
                    }
                  >
                    {playing === song.id ? (
                      <Pause size={20} />
                    ) : (
                      <Play size={20} />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No songs found. Try a different search!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
