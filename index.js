const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

const apiGenerative = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const mensajeUsuario = req.body.message || "Hola";
        console.log("Mensaje de Roblox recibido correctamente:", mensajeUsuario);

        const motorIA = apiGenerative.getGenerativeModel({ 
            model: "gemini-1.5-pro" 
        });

        const resultado = await motorIA.generateContent(mensajeUsuario);
        const respuestaFinal = await resultado.response.text();
        
        res.json({ reply: respuestaFinal });

    } catch (error) {
        console.error("DETALLE DEL ERROR DE GEMINI:", error);
        res.status(500).json({ reply: "¡Ay no! Tuve un problema interno con la IA." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
