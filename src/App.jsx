import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import "./App.css";

export default function App() {
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
      // If the same song is playing, pause it
      if (audio) {
        audio.pause();
        setPlaying(null);
      }
    } else {
      // Stop currently playing audio
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Create a new audio instance
      const newAudio = new Audio(url);
      newAudio.volume = 1.0;

      // Try playing the song
      newAudio
        .play()
        .then(() => {
          setAudio(newAudio); // Save the new audio instance
          setPlaying(id); // Mark song as playing
        })
        .catch((error) => console.error("Error playing audio:", error));

      // Reset playing state when the song ends
      newAudio.onended = () => {
        setPlaying(null);
      };
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
