const express = require('express');
const app = express();

app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        // Recibimos todo el historial de la conversación que manda Roblox
        const historialMensajes = req.body.contents;
        console.log("Historial recibido:", JSON.stringify(historialMensajes));

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: historialMensajes
            })
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
