import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { answers } = req.body;

  if (!answers) return res.status(400).json({ error: 'No answers provided' });

  const prompt = `
Genera un brief profesional, claro y estructurado para el proyecto con esta información:

Nombre del proyecto: ${answers.projectName}
Audiencia objetivo: ${answers.targetAudience}
Objetivos: ${answers.objectives}
Mensajes clave: ${answers.keyMessages}

El resultado debe ser en español y fácil de entender.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = completion.choices[0].message?.content ?? '';

    res.status(200).json({ content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generando brief' });
  }
}
