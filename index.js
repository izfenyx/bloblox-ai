const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

app.use(express.json());

const clienteGemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const textoEntrada = req.body.message || "Hola";
        console.log("Petición recibida desde Roblox:", textoEntrada);

        // Usamos gemini-1.5-pro con la librería oficial clásica y estable
        const modeloIA = clienteGemini.getGenerativeModel({ 
            model: "gemini-1.5-pro" 
        });

        const respuestaBruta = await modeloIA.generateContent(textoEntrada);
        const respuestaFinal = await respuestaBruta.response.text();
        
        res.json({ reply: respuestaFinal });

    } catch (error) {
        console.error("ERROR CRÍTICO EN GEMINI:", error);
        res.status(500).json({ reply: "¡Ay no! Tuve un problema conectando con la IA." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en línea en el puerto ${PORT}`);
});
