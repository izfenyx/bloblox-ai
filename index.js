const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const app = express();

app.use(express.json());

// Inicializar Google Gen AI con la variable de entorno
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message || "Hola";
        console.log("Mensaje recibido de Roblox:", userMessage);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: "Eres una chica de anime amigable y conversacional que vive dentro de un juego de Roblox. Responde de forma breve y tierna.",
            },
        });

        const reply = response.text;
        res.json({ reply: reply });

    } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        res.status(500).json({ reply: "¡Ay no! Me mareé un poco con la nube." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
