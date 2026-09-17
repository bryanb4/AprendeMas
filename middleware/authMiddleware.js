const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message: "Token requerido"
        });

    }

    let token = authHeader;

    // Si viene como "Bearer xxx"
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token inválido"
        });

    }

};