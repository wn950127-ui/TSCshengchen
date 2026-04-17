import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route for Gemini calls
  app.post('/api/gemini/generate', async (req, res) => {
    try {
      const { model, prompt, systemInstruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key is not configured." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents: { parts: prompt },
        config: { 
          systemInstruction: systemInstruction,
          thinkingConfig: { thinkingBudget: 2048 }
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content." });
    }
  });

  // API Route for Vision / OCR
  app.post('/api/gemini/vision', async (req, res) => {
    try {
      const { model, prompt, imagePart } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key is not configured." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              imagePart
            ],
          }
        ]
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Vision API Error:", error);
      res.status(500).json({ error: error.message || "Failed to process image." });
    }
  });

  const distPath = path.join(process.cwd(), 'dist');
  const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

  // Vite middleware for development
  if (!isProd) {
    try {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
    } catch (err) {
        console.error("Failed to load vite:", err);
    }
  } else {
    // Serve static files in production
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
