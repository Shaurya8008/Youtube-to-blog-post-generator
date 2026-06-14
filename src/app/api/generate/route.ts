import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { url, tone, length } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "YouTube URL is required." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ error: "Server Configuration Error: Gemini API key is missing." }, { status: 500 });
    }

    // 1. Fetch Transcript
    let transcriptLines;
    try {
      transcriptLines = await YoutubeTranscript.fetchTranscript(url);
    } catch (error) {
      console.error("Transcript error:", error);
      return NextResponse.json(
        { error: "Could not fetch transcript. Please ensure the video has closed captions enabled, and is not private or age-restricted." },
        { status: 400 }
      );
    }

    if (!transcriptLines || transcriptLines.length === 0) {
      return NextResponse.json(
        { error: "No transcript found for this video." },
        { status: 400 }
      );
    }

    // Join the transcript text
    const fullTranscript = transcriptLines.map((line) => line.text).join(" ");

    // 2. Generate Blog Post
    const prompt = `
You are an expert blog post writer. Convert the following YouTube video transcript into a well-structured, engaging, and SEO-friendly blog post.

Requirements:
- Tone: ${tone}
- Desired Length Profile: ${length} (Adapt the depth of content based on this preference)
- Format: Strictly use Markdown. Include an engaging H1 title, H2/H3 subheadings, and formatting (bold, italic, lists) where appropriate to break up text.
- Content: Do not simply summarize in a list. Write flowing paragraphs as a real blog post.
- Purity: Do NOT include introductory conversational text (e.g. "Here is your blog post"). Start immediately with the H1 title.

Video Transcript:
${fullTranscript.substring(0, 100000)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ content: response.text });
  } catch (error: any) {
    console.error("API Error:", error);
    
    // Check for Gemini API 503 error
    if (error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("unavailable")) {
      return NextResponse.json(
        { error: "The Google Gemini AI service is currently overloaded or temporarily unavailable. Please try again in a few minutes." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "An internal server error occurred while generating the blog post." },
      { status: 500 }
    );
  }
}
