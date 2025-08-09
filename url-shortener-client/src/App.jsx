import { useState, useEffect } from "react";
import './App.css';

const BASE_API = "http://localhost:5000";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);

  // Sab URLs fetch karne ke liye
  const fetchUrls = async () => {
    try {
      const res = await fetch(`${BASE_API}/`);
      const data = await res.json();
      setUrls(data);
    } catch (err) {
      console.error("Failed to fetch URLs", err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl) {
      alert("Please enter a URL");
      return;
    }

    try {
      const res = await fetch(`${BASE_API}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl }),
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setShortUrl(data.shortUrl);
        fetchUrls();
      }
    } catch (err) {
      alert("Failed to shorten URL");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>URL Shortener Service</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          style={{ width: "80%", padding: "10px", fontSize: "1rem" }}
          required
        />
        <button type="submit" style={{ padding: "10px 15px", marginLeft: 10 }}>
          Shorten
        </button>
      </form>

      {shortUrl && (
        <p>
          Short URL:{" "}
          <a href={shortUrl} target="_blank" rel="noreferrer" style={{ color: "blue" }}>
            {shortUrl}
          </a>
        </p>
      )}

      <h3>All URLs</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Short URL</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Long URL</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url._id}>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                <a href={`${BASE_API}/${url.shortId}`} target="_blank" rel="noreferrer">
                  {`${BASE_API}/${url.shortId}`}
                </a>
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                <a href={url.longUrl} target="_blank" rel="noreferrer">
                  {url.longUrl}
                </a>
              </td>
              <td style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>{url.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
