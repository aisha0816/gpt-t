async function getBotResponse(userInput) {
    let apiKey = sessionStorage.getItem("gemini_key");
    
    if (!apiKey) {
        apiKey = prompt("Please enter your Gemini API Key (AIza...) to begin our session:");
        if (apiKey) {
            sessionStorage.setItem("gemini_key", apiKey);
        } else {
            return "Authentication required. Please refresh to proceed.";
        }
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "You are Aisha's sophisticated AI learning mentor. Your tone is professional, articulate, and intellectually stimulating. Avoid slang. Provide clear, logical explanations and break complex academic tasks into structured, manageable objectives. User says: " + userInput
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return "Technical Error: " + data.error.message;
        }

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "The AI encountered an issue. Please rephrase your query.";
        }

    } catch (error) {
        return "Connection Error. Please verify your network and API credentials.";
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
    const cleanResponse = response.replace(/[#*]/g, "").trim(); 

    document.getElementById(loadingId).innerText = cleanResponse;
    chatbox.scrollTop = chatbox.scrollHeight;
}