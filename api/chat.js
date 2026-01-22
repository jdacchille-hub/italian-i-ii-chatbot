import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    console.log("Message received:", message);

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: message
        })
      }
    );

    const data = await openaiResponse.json();

    console.log("OpenAI response received");

    res.status(200).json({
      reply: data.output_text
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.toString() });
  }
}
