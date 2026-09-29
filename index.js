const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message || "Hola";
        console.log("Mensaje recibido de Roblox:", userMessage);

        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro"
        });

        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const reply = response.text();
        
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
