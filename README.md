# YouTube to Blog Generator 🚀

An AI-powered web application that instantly transforms any YouTube video into a beautifully formatted, SEO-friendly blog post.

## Features ✨

- **Instant Conversion**: Paste a YouTube URL and get a ready-to-publish blog post in seconds.
- **Customizable Tone**: Choose from Professional, Casual, Humorous, or Educational tones to match your audience.
- **Adjustable Length**: Tailor the output to be Short (500 words), Medium (1000 words), or Long (1500+ words).
- **Premium UI**: Built with a sleek, minimalist aesthetic featuring glassmorphism and smooth micro-animations.
- **One-Click Copy**: Easily copy the generated Markdown directly to your clipboard.

## Tech Stack 🛠️

- **Frontend Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: Vanilla CSS Modules for a highly custom, performant design.
- **AI Integration**: [Google Gemini 2.5 Flash API](https://ai.google.dev/) via `@google/genai`.
- **Data Fetching**: `youtube-transcript` for retrieving video closed captions.
- **Markdown Parsing**: `react-markdown` for rendering the AI output beautifully.

## Getting Started 💻

### Prerequisites

You will need a Google Gemini API Key. You can get one for free at [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shaurya8008/Youtube-to-blog-post-generator.git
   cd Youtube-to-blog-post-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## How it Works 🧠

1. The user inputs a YouTube URL.
2. The Next.js API route extracts the video ID and uses `youtube-transcript` to fetch the public closed captions.
3. The transcript is compiled and sent to the Gemini 2.5 Flash model with a carefully engineered prompt specifying the desired tone and length.
4. Gemini streams back a fully formatted Markdown blog post.
5. The frontend renders the Markdown using `react-markdown` and provides a seamless copy mechanism.

## Limitations ⚠️
- The application currently requires the target YouTube video to have public Closed Captions (CC) enabled. It cannot transcribe videos without existing captions.
- Extremely long videos might take longer to process depending on the API payload size.

## License 📄
This project is open-sourced under the MIT License.
