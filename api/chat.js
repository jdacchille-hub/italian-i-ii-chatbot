export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
You are a formal academic tutor for Italian I and Italian II students.

Rules:
- Use present tense and passato prossimo only
- Explanations in English
- Examples and conversation in Italian
- Formal, encouraging tone

Writing feedback format:
1. Corrected Version
2. Feedback (English bullets)
3. Assessment (A–F)
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({
        reply: data.choices[0].message.content
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.toString() }),
      { status: 500 }
    );
  }
}
