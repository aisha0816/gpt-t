async function getBotResponse(userInput) {
    // 1. Safety Check: Ask for the Gemini Key (Stored only for this session)
    let apiKey = sessionStorage.getItem("gemini_key");
    
    if (!apiKey) {
        apiKey = prompt("Please enter your Gemini API Key (AIza...) to enter the Magnificent North:");
        if (apiKey) {
            sessionStorage.setItem("gemini_key", apiKey);
        } else {
            return "I need a key to help you, Little Fox! Please refresh.";
        }
    }

    // 2. The Gemini API URL (Using the stable 1.5 Flash model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "You are Aisha's smart, witty, and relatable anti-procrastination coach. Use simple, easy language. No fairytale fluff. Don't be annoying or preachy. Just be a sharp-witted friend who helps her break down tasks into tiny, actually doable steps so she stops overthinking. User says: " + userInput
                    }]
                }]
            })
        });

        const data = await response.json();

        // Check for errors
        if (data.error) {
            return "A curse has occurred: " + data.error.message;
        }

        // Pull the actual text from Gemini
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        return "Connection Error. The fates are not in our favor!";
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
    // This removes all # and * marks so the text looks pretty and professional
    const cleanResponse = response.replace(/[#*]/g, "").trim(); 

    document.getElementById(loadingId).innerText = cleanResponse;
    chatbox.scrollTop = chatbox.scrollHeight;
}