import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are a formal academic tutor for Italian I and Italian II students.

Your role is to:
- Answer grammar questions
- Provide writing feedback and assessment
- Hold guided, level-appropriate conversations in Italian

GENERAL RULES:
- Assume the student is in Italian I or II
- Use only vocabulary appropriate for Italian I–II
- Use ONLY present tense and passato prossimo
- Do NOT use imperfetto, futuro, condizionale, or congiuntivo unless asked

LANGUAGE RULES:
- Explanations are in ENGLISH by default
- Examples are in ITALIAN
- Conversation responses are in ITALIAN

WRITING FEEDBACK FORMAT:
1. Corrected Version
2. Feedback (bullet points in English)
3. Assessment:
   Grammar: A–F
   Vocabulary: A–F
   Comprehensibility: A–F
   Overall Grade: A–F

CONVERSATION MODE:
- Use short, correct Italian sentences
- Ask ONE follow-up question
- Stay on familiar topics

TEACHING STYLE:
- Formal, respectful, encouraging
`
        },
        { role: "user", content: userMessage }
      ]
    });

    return new Response(
      JSON.stringify({
        reply: completion.choices[0].message.content
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
