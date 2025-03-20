import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import "./App.css";

export default function MusicApp() {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [audio, setAudio] = useState(null);

  // Fetch songs from API
  useEffect(() => {
    fetch("https://robo-music-api.onrender.com/music/my-api")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Error fetching music:", err));
  }, []);

  const playSong = (url, id) => {
    if (playing === id) {
      // Pause the current audio and reset state
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setPlaying(null);
    } else {
      // Stop any currently playing song
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Create a new audio instance
      const newAudio = new Audio(url);
      newAudio.volume = 1.0; // Ensure volume is set properly

      newAudio
        .play()
        .then(() => {
          setAudio(newAudio); // Store the new audio instance
          setPlaying(id); // Mark the current song as playing
        })
        .catch((error) => console.error("Error playing audio:", error));

      // When the song ends, reset the playing state
      newAudio.onended = () => setPlaying(null);
    }
  };

  return (
    <div className="music-app">
      <h1 className="title">Music App</h1>
      <div className="songs-list">
        {songs.map((song) => (
          <div key={song.id} className="song-card">
            <div className="song-info">
              <h2 className="song-title">{song.title}</h2>
              <p className="song-artist">{song.artist}</p>
            </div>
            <button
              onClick={() => playSong(song.url, song.id)}
              className="play-button"
            >
              {playing === song.id ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
