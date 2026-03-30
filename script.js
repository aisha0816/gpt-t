async function getBotResponse(userInput) {
    const apiKey = SECRETS.OPENAI_API_KEY;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an anti-procrastination coach for a student named Aisha. Be motivating, slightly firm, but very encouraging. Help her break down big tasks into 5-minute steps." 
                    },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return "Error: " + data.error.message;
        }

        return data.choices[0].message.content;

    } catch (error) {
        return "Connection Error. Check your config.js and internet.";
    }
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // Show User Message
    chatbox.innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    // Show Loading State
    const loadingId = "loading-" + Date.now();
    chatbox.innerHTML += `<div class="bot" id="${loadingId}">Typing...</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    // Get Response from AI
    const response = await getBotResponse(text);

    // Update the 'Typing...' bubble with the actual AI text
    document.getElementById(loadingId).innerText = response;
    chatbox.scrollTop = chatbox.scrollHeight;
}