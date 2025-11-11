import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function TrackPlayer({ src, title }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // create the audio element when component mounts
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
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleListenNow = () => {
    navigate("/app");
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus("error");
      return;
    }

    // Try Formspree integration if endpoint is configured, otherwise simulate
    const FORM_ENDPOINT = "https://formspree.io/f/yourFormId"; // replace yourFormId with your actual form id

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

  const sampleTracks = [
    {
      id: 1,
      title: "Morning Flow",
      artist: "TuneTrail",
      url: "https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3",
    },
    {
      id: 2,
      title: "Evening Chill",
      artist: "TuneTrail",
      url: "https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_1MG.mp3",
    },
    {
      id: 3,
      title: "Night Drive",
      artist: "TuneTrail",
      url: "https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_2MG.mp3",
    },
  ];

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
            <Link to="https://twitter.com/TuneTrail" className="social-icon-link" title="Twitter">
              <img
                src="/src/assets/x-icon.png"
                className="media-svg"
                alt="Twitter"
              />
            </Link>
            <Link to=" https://www.instagram.com/tunetrail/" className="social-icon-link" title="Instagram">
              <img
                src="/src/assets/ig-icon.png"
                className="media-svg"
                alt="Instagram"
              />
            </Link>
            <Link to=" https://www.facebook.com/TuneTrail" className="social-icon-link" title="Facebook">
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
        <div className="tracks">
          {sampleTracks.map((track) => (
            <article key={track.id} className="track-card">
              <div className="track-info">
                <strong className="track-title">{track.title}</strong>
                <span className="track-artist">{track.artist}</span>
              </div>
              <TrackPlayer src={track.url} title={track.title} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Landpage;
