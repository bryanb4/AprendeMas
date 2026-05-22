const OpenAI = require("openai");
const questionSchema = require('../schemas/question_schema');
const { json } = require("express");

const client = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1"
});

async function getAIResponse({ subject, topic, level }) {

  const prompt = `Genera una pregunta con los siguientes parámetros obligatorios:
    - MATERIA EXACTA: ${subject}
    - TEMA EXACTO: ${topic}
    - NIVEL DE DIFICULTAD: ${level}

    REGLA CRÍTICA: Debes apegarte estrictamente al tema "${topic}". No inventes ni uses un tema de matemáticas diferente.
`;

  try {

    const response = await client.chat.completions.create({
      model: "gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt
        },
        {
          role: "system",
          content: `Eres un experto diseñador de exámenes para el ingreso a la preparatoria UDG. 
          Tu única tarea es generar preguntas de opción múltiple con un formato JSON estricto.

          REGLAS DE CONTENIDO:
          - La pregunta debe ser EXCLUSIVAMENTE de matemáticas. NO generes física, química ni ciencias.
          - Debe tener exactamente 4 opciones y solo una respuesta correcta.
          - Usa un lenguaje claro y adecuado para alumnos de secundaria.
          - Verifica que la respuesta correcta coincida perfectamente con la explicación y que no existan contradicciones.

          REGLAS DE FORMATO MATEMÁTICO:
          - Todas las expresiones, variables o números matemáticos deben usar sintaxis compatible con KaTeX.
          - Usa $ ... $ para matemáticas inline (ejemplo: $x = 2$, $30\\%$).
          - Usa $$ ... $$ para bloques matemáticos destacados.
          - NO uses Markdown matemático alternativo. Escapa correctamente los caracteres de LaTeX (como la doble barra invertida \\\\ si es necesario).`
        }
      ],
      temperature: 0,
      max_tokens: 4000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'question_schema',
          strict: true,
          schema: questionSchema
        }
      }
    }
    );

    json_parsed = JSON.parse(response.choices[0].message.content)
    return json_parsed;

  } catch (error) {

    console.error("Error IA:", error);

    throw new Error("No se pudo generar la pregunta");
  }
}

module.exports = {
  getAIResponse
};