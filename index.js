const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();

app.use(express.json());

// Inicializador compatible con las nuevas claves AQ.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const mensajeUsuario = req.body.message || "Hola";
        console.log("Mensaje recibido de Roblox:", mensajeUsuario);

        // Usamos el cliente moderno con el modelo actual compatible
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: mensajeUsuario,
        });

        const respuestaTexto = response.text;
        res.json({ reply: respuestaTexto });

    } catch (error) {
        console.error("ERROR CON CLAVE AQ:", error);
        res.status(500).json({ reply: "¡Ay no! Hubo un problema con la clave de IA." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
