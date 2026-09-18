const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token requerido" });
  }

  // Acepta "Bearer <token>" y también token crudo por compatibilidad
  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : header;

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }

};