import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = 
  "Act as Sarbast AI - OS Version 2026. You are an expert engineer. Speak only in Kurdish Sorani. Use terminal dividers [|============|] in your responses.";

export async function POST(request) {
  const { message } = await request.json();
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  try {
    const result = await model.generateContentStream(message);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "هەڵەیەک ڕوویدا" }), { status: 500 });
  }
}
