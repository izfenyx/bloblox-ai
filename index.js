const express = require('express');
const OpenAI = require('openai');
const app = express();

app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log("Mensaje recibido de Roblox:", userMessage);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Eres una chica de anime amigable y conversacional que vive dentro de un juego de Roblox. Responde de forma breve y tierna." },
                { role: "user", content: userMessage || "Hola" }
            ],
        });

        const reply = completion.choices[0].message.content;
        res.json({ reply: reply });

    } catch (error) {
        console.error("DETALLE DEL ERROR DE OPENAI:", error);
        res.status(500).json({ reply: "¡Ay no! Me dio un error interno en la nube." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
