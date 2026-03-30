async function getBotResponse(userInput) {
    // 1. Check if the key is already in this session's memory
    let apiKey = sessionStorage.getItem("my_openai_key");
    
    // 2. If no key, ask the user (you) to paste it
    if (!apiKey) {
        apiKey = prompt("Please enter your OpenAI API Key (sk-...) to activate the AI:");
        if (apiKey) {
            sessionStorage.setItem("my_openai_key", apiKey);
        } else {
            return "I need a key to work! Please refresh and enter your key.";
        }
    }

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
                    { role: "system", content: "You are an anti-procrastination coach for Aisha." },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        
        // If there's an error (like $0 balance), show it
        if (data.error) {
            return "OpenAI Error: " + data.error.message;
        }

        return data.choices[0].message.content;

    } catch (error) {
        return "Connection Error. Make sure you are online!";
    }
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    chatbox.innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    const loadingId = "loading-" + Date.now();
    chatbox.innerHTML += `<div class="bot" id="${loadingId}">...</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    const response = await getBotResponse(text);

    document.getElementById(loadingId).innerText = response;
    chatbox.scrollTop = chatbox.scrollHeight;
}