import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function TrackPlayer({ src, title }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    
    audioRef.current = new Audio(src);
    const a = audioRef.current;
    const onEnded = () => setPlaying(false);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("ended", onEnded);
      a.pause();
      audioRef.current = null;
    };
  }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.volume = 1.0;
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <button 
      className="track-play" 
      onClick={toggle} 
      aria-pressed={playing}
      title={title}
      aria-label={`${playing ? 'Pause' : 'Play'} ${title}`}
    >
      {playing ? "Pause" : "Play"}
    </button>
  );
}

function Landpage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [sampleTracks, setSampleTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(true);

  const handleListenNow = () => {
    navigate("/app");
  };

  // Fetch first 3 songs from the API
  useEffect(() => {
    fetch("https://robo-music-api.onrender.com/music/my-api")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch songs");
        return res.json();
      })
      .then((data) => {
        // Take only the first 3 songs
        setSampleTracks((data || []).slice(0, 3));
        setTracksLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sample tracks:", err);
        setTracksLoading(false);
      });
  }, []);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus("error");
      return;
    }

    const FORM_ENDPOINT = "https://formspree.io/f/yourFormId"; 

    setStatus("sending");
    if (!FORM_ENDPOINT.includes("yourFormId")) {
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((res) => {
          if (res.ok) {
            setStatus("success");
            setEmail("");
          } else {
            throw new Error("Network response was not ok");
          }
        })
        .catch(() => setStatus("error"));
    } else {
      // fallback: simulate submit locally
      setTimeout(() => {
        console.log("Captured email (local):", email);
        setStatus("success");
        setEmail("");
      }, 800);
    }
  };

  return (
    <div>
      <div className="head">
        <h1 className="logo">TuneTrail</h1>
        <nav className="right-head">
          <div>
            <Link to="/about" className="nav-link">
              ABOUT
            </Link>
            <Link to="/blog" className="nav-link">
              BLOG
            </Link>
            <Link to="/contact" className="nav-link">
              CONTACT
            </Link>
          </div>
          <div className="media-cont">
            <Link to="https://twitter.com/TuneTrail" className="social-icon-link" data-tooltip="Twitter">
              <img
                src="/src/assets/x-icon.png"
                className="media-svg"
                alt="Twitter"
              />
            </Link>
            <Link to=" https://www.instagram.com/tunetrail/" className="social-icon-link" data-tooltip="Instagram">
              <img
                src="/src/assets/ig-icon.png"
                className="media-svg"
                alt="Instagram"
              />
            </Link>
            <Link to=" https://www.facebook.com/TuneTrail" className="social-icon-link" data-tooltip="Facebook">
              <img
                src="/src/assets/fb-icon.png"
                className="media-svg"
                alt="Facebook"
              />
            </Link>
          </div>
        </nav>
      </div>
      <main className="hero hero-enhanced" aria-labelledby="hero-title">
        <div className="hero-content">
          <img
            src="/src/assets/music.png"
            alt="Musical background"
            className="hero-img"
          />
          <h2 id="hero-title" className="hero-title">
            YOUR PERSONAL SOUNDTRACK
          </h2>
          <p className="hero-sub">
            Discover, play, and build playlists that follow your day — from
            focus to celebration.
          </p>

          <div className="hero-ctas">
            <button
              className="litn-btn litn-btn-large"
              onClick={handleListenNow}
              aria-label="Open TuneTrail app"
            >
              Listen Now
            </button>

            <form
              className="hero-form"
              onSubmit={handleSubmit}
              aria-label="Join waitlist"
            >
              <label htmlFor="hero-email" className="visually-hidden">
                Email address
              </label>
              <input
                id="hero-email"
                className="email-input"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                placeholder="Enter your email for early access"
                aria-label="Email address for early access"
                required
              />
              <button type="submit" className="email-cta" aria-live="polite">
                {status === "sending" ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          </div>

          {status === "error" && (
            <p className="form-error" role="alert">
              Please enter a valid email address.
            </p>
          )}
          {status === "success" && (
            <p className="form-success" role="status">
              Thanks — we'll let you know when we launch!
            </p>
          )}
        </div>
      </main>

      <section className="featured">
        <h3 className="featured-title">Featured samples</h3>
        {tracksLoading ? (
          <p className="loading-text">Loading songs...</p>
        ) : sampleTracks.length > 0 ? (
          <div className="tracks">
            {sampleTracks.map((track) => (
              <article key={track.id} className="track-card">
                <div className="track-info">
                  <strong className="track-title">{track.songTitle}</strong>
                  <span className="track-artist">{track.artistName}</span>
                </div>
                <TrackPlayer src={track.songUrl} title={track.songTitle} />
              </article>
            ))}
          </div>
        ) : (
          <p className="no-tracks-text">No songs available at the moment.</p>
        )}
      </section>
    </div>
  );
}

export default Landpage;
