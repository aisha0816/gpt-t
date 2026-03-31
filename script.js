async function getBotResponse(userInput) {
    // 1. Safety Check: Ask for the Gemini Key
    let apiKey = sessionStorage.getItem("gemini_key");
    
    if (!apiKey) {
        apiKey = prompt("Please enter your Gemini API Key (AIza...) to begin our session:");
        if (apiKey) {
            sessionStorage.setItem("gemini_key", apiKey);
        } else {
            return "Authentication required. Please refresh to proceed.";
        }
    }

    // 2. THE STABLE URL (v1 for reliability)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "You are Aisha's sophisticated AI learning mentor. Your tone is professional, articulate, and intellectually stimulating, yet accessible. Avoid slang and overly dramatic flair. Provide clear, logical explanations and break complex academic tasks into structured, manageable objectives. Direct your guidance toward a high-achieving teenager who values efficiency and clarity. User says: " + userInput
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return "Technical Error: " + data.error.message;
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "The AI encountered an issue generating a response. Please rephrase your query.";
        }

    } catch (error) {
        return "Connection Error. Please verify your network stability and API credentials.";
    }
}