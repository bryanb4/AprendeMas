const questionSchema = {
  type: "object",
  properties: {
    materia_solicitada: { type: "string" },
    tema_solicitado: { type: "string" },
    nivel_solicitado: {type: "string"},
    pregunta: { type: "string" },
    opciones: {
      type: "array",
      items: { type: "string" }
    },
    respuesta_correcta: { type: "string" },
    explicacion: { type: "string" }
  },
  required: [
    "materia_solicitada",
    "tema_solicitado",
    "nivel_solicitado",
    "pregunta",
    "opciones",
    "respuesta_correcta",
    "explicacion"
  ],
  additionalProperties: false
};
module.exports = questionSchema;