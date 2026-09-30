const express = require('express');
const app = express();

app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        // 1. Recibimos el arreglo de mensajes completo enviado desde Roblox
        const historialMensajes = req.body.messages;

        if (!historialMensajes || !Array.isArray(historialMensajes)) {
            console.error("No se recibió un arreglo de mensajes válido.");
            return res.status(400).json({ reply: "¡Ay no! Faltó el historial de mensajes." });
        }

        console.log("Historial de mensajes recibido de Roblox:", JSON.stringify(historialMensajes, null, 2));

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;

        // 2. Traducimos el formato de roles al formato que exige la API de Gemini (user / model)
        let contentsGemini = [];
        let systemInstructionText = "";

        for (let msg of historialMensajes) {
            if (msg.role === "system") {
                systemInstructionText += msg.content + "\n";
            } else if (msg.role === "user") {
                contentsGemini.push({
                    role: "user",
                    parts: [{ text: msg.content }]
                });
            } else if (msg.role === "assistant") {
                contentsGemini.push({
                    role: "model",
                    parts: [{ text: msg.content }]
                });
            }
        }

        let bodyPayload = {
            contents: contentsGemini
        };

        if (systemInstructionText !== "") {
            bodyPayload.system_instruction = {
                parts: [{ text: systemInstructionText.trim() }]
            };
        }

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload)
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            console.error("Error de la API de Google:", data);
            return res.status(500).json({ reply: "¡Ay no! Google rechazó la conexión." });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply: reply });

    } catch (error) {
        console.error("ERROR CRÍTICO:", error);
        res.status(500).json({ reply: "¡Ay no! Falló el servidor." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});
