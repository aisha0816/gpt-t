async function getBotResponse(userInput) {
    // 1. Safety Check: Ask for the Gemini Key
    let apiKey = sessionStorage.getItem("gemini_key");
    
    if (!apiKey) {
        apiKey = prompt("Please enter your Gemini API Key (AIza...) to start:");
        if (apiKey) {
            sessionStorage.setItem("gemini_key", apiKey);
        } else {
            return "I need a key to help you! Please refresh.";
        }
    }

    // 2. The Gemini API URL (Using the stable v1 path for reliability)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "You are Aisha's adaptive, conversational AI learning companion. Use clear, natural language. No robotic jargon. Don't be overly formal or dramatic. Just be a sharp, responsive guide who explains things simply, adjusts to her level, and helps her understand ideas step-by-step without overcomplicating them. User says: " + userInput
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return "Gemini Error: " + data.error.message;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        return "Connection Error. Make sure your internet is on and your key is correct!";
    }
}

// Handles the Chat Bubbles and Cleaning
async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatbox = document.getElementById("chatbox");
    const text = input.value.trim();

    if (!text) return;

    // Show User Message
    chatbox.innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    // Show placeholder
    const loadingId = "loading-" + Date.now();
    chatbox.innerHTML += `<div class="bot" id="${loadingId}">...</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    // Get the AI's actual response
    const response = await getBotResponse(text);

    // ✨ THE CLEANING LOGIC ✨
    // Removes all # and * marks
    const cleanResponse = response.replace(/[#*]/g, "").trim(); 

    document.getElementById(loadingId).innerText = cleanResponse;
    chatbox.scrollTop = chatbox.scrollHeight;
}