import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import "../components/App.css";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);

  // Fetch songs from API
  useEffect(() => {
    fetch("https://robo-music-api.onrender.com/music/my-api")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSongs(data);
      })
      .catch((err) => {
        console.error("Error fetching music:", err);
        setError("Failed to load songs. Please try again later.");
      });
  }, []);

  const playSong = (url, id) => {
    console.log(`Attempting to play song with URL: ${url} and ID: ${id}`);
    if (playing === id) {
      // If the same song is playing, pause it
      if (audio) {
        console.log("Pausing current song");
        audio.pause();
        setPlaying(null);
      }
    } else {
      // Stop currently playing audio
      if (audio) {
        console.log("Stopping current song");
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
          console.log(`Playing song with ID: ${id}`);
          setAudio(newAudio); // Save the new audio instance
          setPlaying(id); // Mark song as playing
        })
        .catch((error) => console.error("Error playing audio:", error));

      // Reset playing state when the song ends
      newAudio.onended = () => {
        console.log("Song ended");
        setPlaying(null);
      };
    }
  };

  return (
    <section>
      <div className="header">
  
       
      </div>
      <div className="music-app">
        <p className="play-list">PlayList</p>
        {error && <p className="error-message">{error}</p>}
        <div className="songs-list">
          {songs.map((song) => (
            <div key={song.id} className="song-card">
              <div className="song-info">
                <h2 className="song-title">{song.songTitle}</h2>
                <p className="song-artist">{song.artistName}</p>
              </div>
              <button
                onClick={() => playSong(song.songUrl, song.id)}
                className="play-button"
              >
                {playing === song.id ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
