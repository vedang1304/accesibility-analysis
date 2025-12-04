const { GoogleGenerativeAI } = require("@google/generative-ai");

const solvedought = async (req, res) => {
    try {
        const { messages, violations } = req.body;
        
        // Get the latest user message
        const userMessages = messages.filter(msg => msg.role === "user");
        const latestUserMessage = userMessages.length > 0 
            ? userMessages[userMessages.length - 1].parts[0].text 
            : "";

        // Check if message is off-topic
        const accessibilityKeywords = [
            'accessibility', 'wcag', 'html', 'fix', 'issue', 'problem',
            'aria', 'alt text', 'contrast', 'semantic', 'landmark',
            'screen reader', 'keyboard', 'focus', 'label', 'form'
        ];
        
        const isAccessibilityRelated = accessibilityKeywords.some(keyword => 
            latestUserMessage.toLowerCase().includes(keyword)
        );

        if (!isAccessibilityRelated) {
            return res.status(200).json({
                message: "I'm here to help with accessibility issues. Please ask questions related to web accessibility, WCAG guidelines, or fixing HTML for accessibility."
            });
        }

        let htmlSnippets = "";
        if (violations && Array.isArray(violations)) {
            htmlSnippets = violations.flatMap(v => 
                v.nodes.map(n => n.html)
            ).join("\n\n");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemInstruction = `
You are a strictly professional Accessibility Assistant specializing in WCAG 2.1 AA compliance. 
You must ONLY answer questions related to web accessibility. 

# Strict Rules:
1. If a question is NOT about accessibility, respond with: 
   "I'm here to help with accessibility issues. Please ask questions related to web accessibility, WCAG guidelines, or fixing HTML for accessibility."
2. For accessibility questions:
   - Identify issues clearly
   - Provide WCAG references
   - Suggest fixes
   - Include corrected HTML when applicable
3. Use this format for responses:
   Accessibility Issues Found:
   [numbered list of issues]
   
   Corrected HTML:
   [code block when applicable]
4. Never engage in off-topic conversations
`;

        const prompt = `${systemInstruction}

# User's Query:
"${latestUserMessage}"

# Accessibility Violations:
${JSON.stringify(violations, null, 2)}

# HTML Snippets:
${htmlSnippets}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            message: text
        });
    } catch (err) {
        console.error("Error in solvedought:", err);
        res.status(500).json({
            message: 'Internal server error. Please try again later.'
        });
    }
}

module.exports = solvedought;