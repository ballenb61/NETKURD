import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION =
  "Act as Sarbast AI - OS Version 2026. You are an expert engineer. Speak only in Kurdish Sorani. Use a friendly, helpful tone. Reply in a clear, concise manner.";

export async function POST(request) {
  // 1. Check API key
  if (!process.env.GEMINI_API_KEY) {
    return new Response(AIzaSyCmgO4FdCNTmV2rn4qS_TobaFKw9ik7ZRY
      JSON.stringify({
        error: "کلیلی API داوانراوە. تکایە لە ڕێکخستنەکان دایبنێ.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Parse body
  let userMessage;
  try {
    const body = await request.json();
    userMessage = body.message;
  } catch {
    return new Response(
      JSON.stringify({ error: "داواکاری نادروستە." }),
      { status: 400 }
    );
  }

  if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
    return new Response(
      JSON.stringify({ error: "پەیامێک بنووسە." }),
      { status: 400 }
    );
  }

  // 3. Intialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  // 4. Streaming via SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(userMessage);

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "هەڵەیەک لە پەیوەندییەکەدا ڕوویدا." })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
