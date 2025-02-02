'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred.' }]);
    }

    setIsLoading(false);
    setInput('');
  };

  return (
    <div className="flex h-screen flex-col bg-[#0E1117]">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0E1117] px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">OpenSeek 👀 </h1>
          {/* <div className="text-sm text-gray-400">English ⟷ Russian</div> */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2 mt-10">Welcome to OpenSeek</h2>
                <p className="text-gray-400">The uncensored AI assistant</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`px-4 py-8 ${
                    message.role === 'assistant' ? 'bg-[#161B22]' : ''
                  }`}
                >
                  <div className="mx-auto flex max-w-4xl items-start gap-6">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border border-gray-800 bg-[#0E1117]">
                      {message.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-400 mb-1">
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </p>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-100 whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 bg-[#0E1117] p-4">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message in English..."
              className="flex-1 rounded-lg bg-[#161B22] px-4 py-3 text-white placeholder-gray-400 border border-gray-800 focus:border-gray-600 focus:outline-none focus:ring-0 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-3 text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#0E1117] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing</span>
                </>
              ) : (
                <>
                  {/* <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> */}
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 