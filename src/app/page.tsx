"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Loader2, FileText, Check, Copy, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [url, setUrl] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, tone, length }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate blog post");
      }

      setResult(data.content);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>YouTube to Blog</h1>
        <p className={styles.subtitle}>
          Transform any YouTube video into a beautifully formatted blog post instantly.
        </p>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleGenerate}>
          <div className={styles.inputGroup}>
            <label htmlFor="url" className={styles.label}>
              YouTube Video URL
            </label>
            <input
              id="url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className={styles.input}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className={styles.controlsRow}>
            <div className={styles.selectGroup}>
              <label htmlFor="tone" className={styles.label}>Tone</label>
              <select 
                id="tone" 
                className={styles.select}
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Humorous">Humorous</option>
                <option value="Educational">Educational</option>
              </select>
            </div>
            
            <div className={styles.selectGroup}>
              <label htmlFor="length" className={styles.label}>Length</label>
              <select 
                id="length" 
                className={styles.select}
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                <option value="Short">Short (500 words)</option>
                <option value="Medium">Medium (1000 words)</option>
                <option value="Long">Long (1500+ words)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading || !url}
          >
            {loading ? (
              <>
                <Loader2 className={styles.spinner} size={20} />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate Blog Post
              </>
            )}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <h2 className={styles.resultTitle}>
              <FileText size={20} />
              Generated Article
            </h2>
            <button 
              onClick={handleCopy} 
              className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
            >
              {copied ? (
                <>
                  <Check size={16} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy Markdown
                </>
              )}
            </button>
          </div>
          <div className="markdown-body">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  );
}
