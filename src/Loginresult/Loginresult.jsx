import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import './Loginresult.css';

const Loginresult = () => {
  const [result, setResult] = useState({ res: false, malicious: false, message: '' });
  const [phishmode, setPhishmode] = useState("site");
  const [isloading, setIsloading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [mailContent, setMailContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (phishmode === "site" && inputValue.trim() === "") {
      setResult({ res: false, malicious: false, message: '' });
    } else if (phishmode === "mail" && mailContent.trim() === "") {
      setResult({ res: false, malicious: false, message: '' });
    }
  }, [inputValue, mailContent, phishmode]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.clear();
        alert("Session expired. Please log in again.");
        navigate("/");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  const handleModeChange = (mode) => {
    setPhishmode(mode);
    setResult({ res: false, malicious: false, message: '' });
    setError('');
  };

  const validateInput = () => {
    if (phishmode === "site") {
      if (!inputValue.trim()) {
        setError("URL is required");
        return false;
      }
    } else {
      if (!mailContent.trim()) {
        setError("Content is required");
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleCheck = async () => {
    if (!validateInput()) return;

    setIsloading(true);
    setResult({ res: false, malicious: false, message: '' });

    try {
      const endpoint = phishmode === "site" ? "api/url" : "api/mail";
      const payload = phishmode === "site"
        ? { url: inputValue, userId: "guest" }
        : { mailContent: mailContent, userId: "guest" };

      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      setResult({
        res: true,
        malicious: data.isMalicious || false,
        message: data.message || 'No message returned'
      });
    } catch (error) {
      console.error('Error:', error);
      setResult({
        res: true,
        malicious: true,
        message: 'Error connecting to the server'
      });
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="resultcard">
      <div className="result">
        <h1 className="resultheader">Phishing Detection</h1>
        <div className="resultfield">
          {phishmode === "site" && (
            <>
              <label>URL:</label>
              <input
                type="url"
                placeholder="Enter website URL to check"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </>
          )}
          
          {phishmode === "mail" && (
            <>
              <label>Email Content:</label>
              <textarea
                placeholder="Paste email content to check"
                value={mailContent}
                onChange={(e) => setMailContent(e.target.value)}
                rows={5}
              />
            </>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="submitbtn">
          <button
            className="btn17"
            onClick={handleCheck}
            disabled={isloading}
          >
            <span className="textcontainer">
              <span className="text">
                {isloading ? "Checking..." : "Is it a phish?"}
              </span>
            </span>
          </button>
        </div>

        {isloading && <div className="loading-spinner">Processing request...</div>}

        {result.res && (
          <div className={`result-box ${result.malicious ? 'danger' : 'safe'}`}>
            <h2>{result.malicious ? "⚠ Caution!" : "✔ Secure!"}</h2>
            <p>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loginresult;
