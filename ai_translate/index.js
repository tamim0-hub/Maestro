const sdk = require('node-appwrite');

module.exports = async function (req, res) {
    // req.body থেকে ডেটা নিন
    const { text, targetLang } = req.body;

    // Logflare API (DeepSeek Free Model) কল করুন
    try {
        const response = await fetch('https://api.logflare.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.LOGFLARE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-v4-flash',
                messages: [
                    { 
                        role: 'system', 
                        content: `You are a translator. Translate the following text to ${targetLang}. Only return the translated text. Do not add any extra words or explanations.` 
                    },
                    { role: 'user', content: text }
                ]
            })
        });

        const data = await response.json();
        const translated = data.choices[0].message.content;

        res.json({ success: true, translated });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};