const sdk = require('node-appwrite');

module.exports = async function (req, res) {
    // ক্লায়েন্ট থেকে ডেটা নিন
    const { text, targetLang } = req.body;

    // যদি ডেটা না আসে, তাহলে এরর রিটার্ন করুন
    if (!text || !targetLang) {
        return res.json({
            success: false,
            error: 'text এবং targetLang প্রয়োজন',
            translated: text || ''
        });
    }

    try {
        // Logflare API (DeepSeek Free Model) কল
        const response = await fetch('https://api.logflare.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.LOGFLARE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-r1-distill-llama-70b:free',
                messages: [
                    {
                        role: 'system',
                        content: `You are a strict translator. Translate the following text to ${targetLang}. Return ONLY the translated text. Do NOT add any explanations, quotes, or extra words.`
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ]
            })
        });

        const data = await response.json();

        // চেক করুন রেসপন্স ঠিক আছে কিনা
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const translated = data.choices[0].message.content;
            return res.json({
                success: true,
                translated: translated
            });
        } else {
            // API ত্রুটিপূর্ণ রেসপন্স দিলে
            console.error('Logflare API ত্রুটি:', data);
            return res.json({
                success: false,
                error: 'API থেকে সঠিক রেসপন্স পাওয়া যায়নি',
                translated: text // ফেলব্যাক হিসেবে মূল টেক্সট
            });
        }
    } catch (error) {
        // নেটওয়ার্ক বা অন্য কোনো ত্রুটি
        console.error('ট্রান্সলেশন ত্রুটি:', error);
        return res.json({
            success: false,
            error: error.message,
            translated: text // ফেলব্যাক হিসেবে মূল টেক্সট
        });
    }
};