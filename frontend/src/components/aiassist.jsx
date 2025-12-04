import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

function ChatAi({ scan }) {
    const [messages, setMessages] = useState([
        { 
            role: 'model', 
            parts: [{ 
                text: "Hello! I'm your Accessibility Assistant. I can help you identify and fix accessibility issues in your HTML. You can:",
                suggestions: [
                    "Scan my HTML for accessibility issues",
                    "Explain WCAG 2.1 AA guidelines",
                    "Show me how to fix specific problems",
                    "Provide corrected code for my HTML"
                ]
            }]
        }
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // Highlight code blocks after rendering
        setTimeout(() => {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }, 100);
    }, [messages]);

    const handleSuggestionClick = (suggestion) => {
        const userMessage = { 
            role: 'user', 
            parts: [{ text: suggestion }] 
        };
        
        setMessages(prev => [...prev, userMessage]);
        handleQuery(suggestion);
    };

    const handleQuery = async (query) => {
        setIsLoading(true);
        
        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [{ role: 'user', parts: [{ text: query }] }],
                violations: scan?.violations || []
            });

            // Parse the response to extract issues and code
            const parts = [];
            let currentText = response.data.message;
            
            // Extract code blocks
            const codeBlocks = currentText.match(/```html[\s\S]*?```/g) || [];
            codeBlocks.forEach((block, index) => {
                const startIndex = currentText.indexOf(block);
                const textBefore = currentText.substring(0, startIndex);
                
                if (textBefore.trim()) {
                    parts.push({
                        type: 'text',
                        content: textBefore
                    });
                }
                
                // Remove the markdown code markers
                const cleanCode = block.replace(/```html|```/g, '').trim();
                parts.push({
                    type: 'code',
                    content: cleanCode
                });
                
                currentText = currentText.substring(startIndex + block.length);
            });
            
            // Add any remaining text
            if (currentText.trim()) {
                parts.push({
                    type: 'text',
                    content: currentText
                });
            }

            setMessages(prev => [
                ...prev, 
                { 
                    role: 'model', 
                    parts
                }
            ]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ 
                    type: 'text',
                    content: "⚠️ Error processing your request. Please try again." 
                }]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!data.message.trim()) return;
        
        const userMessage = { 
            role: 'user', 
            parts: [{ 
                type: 'text',
                content: data.message 
            }] 
        };
        
        setMessages(prev => [...prev, userMessage]);
        reset();
        handleQuery(data.message);
    };

    const renderMessagePart = (part, index) => {
        switch (part.type) {
            case 'text':
                return (
                    <div key={index} className="whitespace-pre-wrap">
                        {part.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                        ))}
                    </div>
                );
            
            case 'code':
                return (
                    <div key={index} className="mt-4">
                        <div className="text-sm font-bold mb-2">Corrected HTML:</div>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{part.content}</code>
                        </pre>
                    </div>
                );
            
            default:
                if (part.suggestions) {
                    return (
                        <div key={index}>
                            <div className="mb-2">{part.text}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {part.suggestions.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        className="badge badge-outline badge-primary cursor-pointer hover:bg-primary hover:text-primary-content"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                }
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px] bg-base-100 rounded-lg shadow-lg">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className={`chat-bubble ${
                            msg.role === "user" 
                                ? "bg-primary text-primary-content" 
                                : "bg-base-200 text-base-content"
                        }`}>
                            {msg.parts.map((part, partIndex) => renderMessagePart(part, partIndex))}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="chat chat-start">
                        <div className="chat-bubble bg-base-200">
                            <span className="loading loading-dots loading-md"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t border-base-300"
            >
                <div className="flex items-center">
                    <input 
                        placeholder="Ask about accessibility issues..." 
                        className="input input-bordered w-full"
                        disabled={isLoading}
                        {...register("message", { required: true })}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary ml-2"
                        disabled={isLoading}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;