import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Component to display conversation messages in the Gemini/Vertex tab
 */
const GeminiVertexChatView = ({ messages, isLoading }) => {
  // Ref for auto-scrolling to bottom of chat
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Gemini & Vertex AI
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Advanced capabilities with Google's latest models
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.role === 'system'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                    {message.functionCalls && message.functionCalls.length > 0 && (
                      <div className="mt-2 border-t border-gray-300 dark:border-gray-600 pt-2">
                        <p className="font-semibold">Function Calls:</p>
                        {message.functionCalls.map((call, idx) => (
                          <div key={idx} className="mt-1">
                            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-1 rounded">
                              {call.name}({JSON.stringify(call.arguments, null, 2)})
                            </code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
                <div className="mt-1 text-xs opacity-70 text-right">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default GeminiVertexChatView;