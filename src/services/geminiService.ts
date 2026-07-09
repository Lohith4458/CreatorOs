// Gemini AI Integration Service for CreatorOS

interface ContentPart {
  text: string;
}

interface Content {
  parts: ContentPart[];
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

// Core API Call to Gemini
async function fetchGemini(prompt: string, apiKey: string): Promise<string> {
  const modelName = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `HTTP error! Status: ${response.status}`);
  }

  const data: GeminiResponse = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Invalid response structure from Gemini API');
  }

  return text;
}

// ----------------------------------------------------
// Smart Mock Generation Fallbacks
// ----------------------------------------------------

function getMockTitles(keywords: string, style: string): string {
  const kw = keywords || 'content creation';
  const list = [
    `How I Mastered ${kw} (And How You Can Too)`,
    `The Brutal Truth About ${kw} Nobody Tells You`,
    `I Tried ${kw} for 30 Days... Here's What Happened`,
    `5 Simple Mistakes Ruining Your ${kw} Strategy`,
    `This 10-Minute ${kw} Routine Will Double Your Views`,
    `The Ultimate Guide to ${kw} in 2026 (Step-by-Step)`,
    `Why Most Creators Fail at ${kw} (And How to Fix It)`
  ];
  return `### Suggested Titles (${style} style)\n\n` + list.map((t, idx) => `${idx + 1}. **${t}**\n   *Hook Concept: Start with a visual gap or a pattern interrupt in the first 3 seconds.*`).join('\n\n');
}

function getMockScript(title: string, niche: string, tone: string, duration: string): string {
  const t = title || 'How to succeed as a content creator';
  const d = duration || '5 minutes';
  return `# Video Script: ${t}
**Niche:** ${niche} | **Tone:** ${tone} | **Target Duration:** ${d}

---

## 1. The Hook (0:00 - 0:30)
*Visual: Zoom in close on face, quick jump cuts, showing a relatable struggle (e.g. staring at an empty timeline).*
*Audio: Energetic background beat starts low, builds up.*

**Script:**
"Have you ever noticed how everyone tells you to just 'post consistently' to grow, but nobody actually explains *what* you're supposed to do when the camera turns on? Today, we're breaking down the exact blueprint that changed everything for me. No fluff, just the actionable steps."

---

## 2. Intro & Setup (0:30 - 1:15)
*Visual: B-roll showing clean shots of desk setup, typing on laptop. Title card overlay.*

**Script:**
"If you're new here, welcome. I make videos helping creators build a sustainable business. Before we dive into point number one, make sure to hit that subscribe button, because we release detailed breakdowns like this every single week. Let's get right into the biggest mistake most people make..."

---

## 3. Core Content Segments (1:15 - 4:00)
*Visual: Switch between talking head and relevant overlays or screenshots of analytics.*

### Point 1: The Strategy Shift
"First, stop trading hours for views. You need to focus on search intent vs. recommendation algorithms..."

### Point 2: The Action Plan
"Second, batch your recording. Do all your research on Monday, script Tuesday, film Wednesday..."

---

## 4. Call To Action & Outro (4:00 - 5:00)
*Visual: Display calendar template on screen, overlay links to other videos.*

**Script:**
"If you want my exact script templates, click the link in the description—it's completely free. And if you want to know how I edit these videos in under an hour, check out this video right here. See you next week!"`;
}

function getMockThumbnail(title: string, style: string): string {
  const t = title || 'Creating viral content';
  return `# Thumbnail Concepts for: "${t}"
**Style:** ${style}

---

### Concept 1: The "Shocking Stat" (High CTR)
*   **Visual Layout:** Split screen. Left side: Confused face looking at phone with a red circle. Right side: A screen graphic showing an analytics chart spiking straight up.
*   **Text Overlay:** "0 to 100k!" in bold Montserrat/Outfit font, neon green text with deep drop shadow.
*   **Color Palette:** Charcoal gray background, neon green accent, hot pink highlights.
*   **AI Visual Prompt:** \`A close-up photograph of a shocked young creator looking at a smartphone glowing with bright neon-green light, dark modern workspace background, split screen with a bright 3D holographic bar graph spiking upwards, highly detailed, photorealistic 8k, cinematic lighting.\`

---

### Concept 2: The "Before vs After" (High Curiosity)
*   **Visual Layout:** Left side (dark/blurry): Frustrated creator looking at a laptop with a giant red 'X'. Right side (bright/vibrant): Happy creator smiling, holding a gold play button.
*   **Text Overlay:** "THE FIX" in massive yellow block capitals across the bottom.
*   **Color Palette:** Deep navy, bright school-bus yellow, warm skin tones.
*   **AI Visual Prompt:** \`Before and after split screen composition, left side shows a frustrated editor in a dark moody room looking at a glowing monitor, right side shows the same person smiling in a brightly lit studio holding a gold plaque, cinematic lighting, 35mm photography.\`
`;
}

function getMockCaption(content: string, platform: string, tone: string): string {
  const text = content || 'My new vlog is out now!';
  return `### Optimized Caption for ${platform} (${tone} tone)

💬 **Caption:**
"Let’s be honest: content creation is 10% filming and 90% fighting the algorithm. 😅 If you've been struggling to get your videos noticed, my latest breakdown changes everything. 

We cover the exact strategy to batch your content, optimize titles, and write scripts that keep people watching. 📈

👉 Tap the link in my bio to watch the full episode now! Don't miss out."

---

🏷️ **Recommended Hashtags:**
#ContentCreator #CreatorEconomy #${platform}Tips #GrowOn${platform} #InfluencerLife #VideoMarketing #CreatorOS #AlgorithmSecrets #VloggerTips`;
}

function getMockCommentAnalysis(commentsText: string): string {
  const comms = commentsText || '';
  return `# AI Comment Sentiment Analysis

### 📊 Sentiment Breakdown
- **Positive:** 70% 😊 (Excited about tips, love the editing style)
- **Neutral:** 20% 😐 (General remarks, timestamp requests)
- **Negative/Constructive:** 10% 😔 (A few audio issues, request for slower pacing)

---

### 🔑 Key Themes & Common Questions
1. **Audio Setup:** "What microphone are you using?" (Asked by 4 users)
2. **Templates:** "Where can we download the Notion calendar?" (Asked by 3 users)
3. **Pacing:** "The second section went a bit too fast, could you show it step-by-step?"

---

### 🤖 Suggested Quick Replies (Click to Copy)

#### Response 1 (For Microphone questions):
*"Thanks for asking! I'm using the Shure SM7B connected to a Focusrite Solo interface. I'll put a full gear list in the description of the next video!"*

#### Response 2 (For Template inquiries):
*"Hey! The templates are linked right at the top of the description box. Let me know if you run into any issues downloading them!"*

#### Response 3 (For Pacing feedback):
*"Appreciate the feedback! I'll make sure to slow down and show the detailed steps in my upcoming follow-up video. Thanks for helping me improve!"*`;
}

function getMockChatResponse(chatHistory: { role: string; content: string }[], message: string, profileContext: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi')) {
    return `Hello! I'm your CreatorOS AI Assistant. I have reviewed your profile context (${profileContext || 'General Creator'}). How can I help you brainstorm ideas, review script outlines, or structure your next brand negotiation today?`;
  }
  
  if (msg.includes('brand') || msg.includes('negotiat') || msg.includes('deal')) {
    return `Here is a quick strategy for negotiating your next brand deal:
1. **Define Your Deliverables:** Be explicit (e.g., 60-second integrated mid-roll + 1 Instagram link in bio).
2. **Share Your Demographics:** Highlight your average engagement rate and audience location, not just subscriber counts.
3. **Charge Your Worth:** Standard rates are roughly $20–$30 CPM (Cost Per Thousand Views), but add a 20% premium if they require exclusivity or raw usage rights.

Would you like me to write a professional email draft pitching your rates?`;
  }

  if (msg.includes('script') || msg.includes('video') || msg.includes('hook')) {
    return `To write an engaging hook, follow this 3-step formula:
1. **Identify the Pain Point:** Show what the viewer is struggling with.
2. **Introduce the Solution:** Tease the outcome without giving it away.
3. **Establish Authority:** Briefly state why they should trust you (or show proof).

For example: *"Most YouTubers spend hours editing, but 90% of them fail because they ignore this one setting. Today, I'll show you how to fix it in 3 seconds."*

What is the topic of your next video? I can write a custom hook for you!`;
  }

  return `I understand you're working on: "${message}". 

To help you best:
1. Would you like me to turn this into a structured **YouTube script outline**?
2. Should we generate **catchy titles** that optimize for click-through rate?
3. Or would you like a **TikTok/Shorts storyboard** outline for this topic?

Let me know what path we should take!`;
}

// ----------------------------------------------------
// Public API Methods
// ----------------------------------------------------

export const geminiService = {
  // Method 1: AI Title Generator
  generateTitles: async (keywords: string, style: string, apiKey?: string): Promise<string> => {
    if (!apiKey) {
      return new Promise((resolve) => setTimeout(() => resolve(getMockTitles(keywords, style)), 600));
    }
    const prompt = `You are an expert YouTube strategist. Generate 7 high-CTR video titles based on the keywords/topic: "${keywords}". The style should be "${style}" (e.g. clickbait, educational, storytelling, listicle). Format your response in markdown, listing the titles and a brief explanation of why each title would spark curiosity or get clicks.`;
    return fetchGemini(prompt, apiKey);
  },

  // Method 2: AI Script Outline Writer
  generateScript: async (title: string, niche: string, tone: string, duration: string, apiKey?: string): Promise<string> => {
    if (!apiKey) {
      return new Promise((resolve) => setTimeout(() => resolve(getMockScript(title, niche, tone, duration)), 1000));
    }
    const prompt = `You are a professional video scriptwriter. Create a detailed video script outline for a video titled "${title}" in the "${niche}" niche. The tone should be "${tone}" and the targeted duration is "${duration}". Break down the script into sections: 
1. Hook (first 30s) with visual and audio cues.
2. Intro & Setup.
3. Core Content Segments (point by point with visual ideas).
4. Call to Action (CTA) & Outro.
Provide the output in clean, readable markdown.`;
    return fetchGemini(prompt, apiKey);
  },

  // Method 3: AI Thumbnail Idea Generator
  generateThumbnailIdeas: async (title: string, style: string, apiKey?: string): Promise<string> => {
    if (!apiKey) {
      return new Promise((resolve) => setTimeout(() => resolve(getMockThumbnail(title, style)), 800));
    }
    const prompt = `You are a professional graphic designer and YouTube thumbnail strategist. Create 2 distinct, high-CTR thumbnail concepts for a video titled "${title}". The style should match "${style}". For each concept, detail:
1. Visual Layout and central elements.
2. Text overlay typography, words, and styling.
3. Recommended color palette.
4. An "AI Visual Prompt" that can be pasted into Stable Diffusion, Midjourney, or DALL-E to generate the main background image.
Format your output in clean markdown.`;
    return fetchGemini(prompt, apiKey);
  },

  // Method 4: AI Social Caption & Hashtags
  generateCaption: async (content: string, platform: string, tone: string, apiKey?: string): Promise<string> => {
    if (!apiKey) {
      return new Promise((resolve) => setTimeout(() => resolve(getMockCaption(content, platform, tone)), 700));
    }
    const prompt = `You are an expert social media copywriter. Write a highly engaging caption and list of relevant hashtags for the platform "${platform}" based on the following content summary or script: "${content}". The tone should be "${tone}". Include emojis, clear calls to action, spacing for readability, and 10 highly optimized hashtags. Output in markdown.`;
    return fetchGemini(prompt, apiKey);
  },

  // Method 5: AI Comment Analyzer
  analyzeComments: async (commentsText: string, apiKey?: string): Promise<string> => {
    if (!apiKey) {
      return new Promise((resolve) => setTimeout(() => resolve(getMockCommentAnalysis(commentsText)), 900));
    }
    const prompt = `You are an AI community manager. Analyze the following pasted YouTube comments:\n\n${commentsText}\n\nProvide an analysis in markdown containing:
1. Overall sentiment breakdown (Positive, Neutral, Negative with percentages).
2. Key themes, common questions, or common suggestions raised by viewers.
3. Three suggested quick replies that are professional, helpful, and address the main concerns.`;
    return fetchGemini(prompt, apiKey);
  },

  // Method 6: AI Chat Assistant
  chat: async (chatHistory: { role: string; content: string }[], message: string, profileContext: string, apiKey?: string): Promise<string> => {
    if (!apiKey) {
      return new Promise((resolve) => setTimeout(() => resolve(getMockChatResponse(chatHistory, message, profileContext)), 600));
    }
    
    // Format history for Gemini API
    const historyPrompt = chatHistory.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
    const prompt = `You are the CreatorOS AI Chat Assistant, a specialized AI business advisor and creative coach for content creators.
Your creator profile context is: "${profileContext}".
Here is the chat history:
${historyPrompt}

User's new message: "${message}"

Write a helpful, concise, actionable response. Provide specific advice, outline templates, or drafts if asked. Keep your tone encouraging, professional, and knowledgeable about YouTube algorithms, social media platforms, and sponsor negotiation.`;
    return fetchGemini(prompt, apiKey);
  }
};
