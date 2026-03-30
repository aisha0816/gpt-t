async function getBotResponse(userInput) {
    // 1. Safety Check: Ask for the Gemini Key
    let apiKey = sessionStorage.getItem("gemini_key");
    
    if (!apiKey) {
        apiKey = prompt("Please enter your Gemini API Key (AIza...) to start:");
        if (apiKey) {
            sessionStorage.setItem("gemini_key", apiKey);
        } else {
            return "I need a key to help you crush procrastination! Please refresh.";
        }
    }

    // 2. The Gemini API URL (Using the 1.5 Pro model you have)
    const url = const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "You are a motivating anti-procrastination coach for a student named Aisha. Be witty, encouraging, and give actionable steps. User says: " + userInput
                    }]
                }]
            })
        });

        const data = await response.json();

        // Check for common errors (like an invalid key)
        if (data.error) {
            return "Gemini Error: " + data.error.message;
        }

        // Pull the actual text from Gemini's response structure
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        return "Connection Error. Make sure your internet is on and your key is correct!";
    }
}

// Handles the Chat Bubbles
async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // Show User Message
    chatbox.innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    // Show '...' placeholder
    const loadingId = "loading-" + Date.now();
    chatbox.innerHTML += `<div class="bot" id="${loadingId}">...</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    // Get the AI's actual response
    const response = await getBotResponse(text);

    // Replace '...' with the real answer
    document.getElementById(loadingId).innerText = response;
    chatbox.scrollTop = chatbox.scrollHeight;
}