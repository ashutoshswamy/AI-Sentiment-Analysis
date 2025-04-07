import React, { useState } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Github, Linkedin, ZapIcon } from "lucide-react";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "your-api-key-here";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [sentimentResult, setSentimentResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentimentIcon, setSentimentIcon] = useState("");
  const [error, setError] = useState("");

  const analyzeSentiment = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setSentimentResult("");
    setSentimentIcon("");
    setError("");

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Analyze the sentiment of the following text in detail. Provide a markdown formatted output that includes:

      **Overall Sentiment:** A summary of the overall sentiment (positive, negative, or neutral).
      **Specific Aspects:** Specific aspects of the sentiment, such as customer service, product quality, etc. (use bullet points)
      **Example Phrases:** Examples of phrases that contribute to the sentiment. (use code blocks for direct quotes)

      Text: "${inputText}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setSentimentResult(text);

      if (text.toLowerCase().includes("positive")) {
        setSentimentIcon("😊");
      } else if (text.toLowerCase().includes("negative")) {
        setSentimentIcon("😞");
      } else {
        setSentimentIcon("😐");
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      setError(
        "Failed to analyze sentiment. Please check your API key and try again."
      );
      setSentimentIcon("⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="app-header">
          <ZapIcon size={28} className="logo-icon" />
          <h1>VibeCheck</h1>
        </div>
        <p className="tagline">Analyze the mood. Feel the vibe.</p>

        <div className="input-container">
          <textarea
            placeholder="Drop your text here to check the vibe..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button
            onClick={analyzeSentiment}
            disabled={loading || !inputText.trim()}
            className={loading ? "loading" : ""}
          >
            {loading ? "Checking Vibe..." : "Check Vibe"}
          </button>
        </div>

        {sentimentResult && (
          <div className="result">
            {sentimentIcon && (
              <div className="sentiment-icon">{sentimentIcon}</div>
            )}
            <div className="vibe-meter">
              <div className="vibe-label">Vibe Report</div>
              <div className="pulse-animation"></div>
            </div>
            <div className="result-content">
              <ReactMarkdown>{sentimentResult}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="developer-info">
          <p>Developed by Ashutosh Swamy</p>
          <div className="social-links">
            <a
              href="https://github.com/ashutoshswamy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/ashutoshswamy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
