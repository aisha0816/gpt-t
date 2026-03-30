async function getBotResponse(userInput) {
    // It pulls the key from your local config.js file
    const apiKey = SECRETS.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: userInput }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}