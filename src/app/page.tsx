'use client';

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  role: string;
  content: string;
  translations?: {
    russian?: string;
    english?: string;
  };
  model?: string;
};

type ProcessStep = {
  name: string;
  status: 'pending' | 'loading' | 'complete';
  output?: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [showResearchModal, setShowResearchModal] = useState(false);
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
      <div className="border-b border-gray-800/60 bg-[#0E1117]/80 backdrop-blur-sm px-4 py-4 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            OpenSeek <span className="text-pink-500">👀</span>
          </h1>
          <div className="flex items-center space-x-4">
            {/* <span className="text-xs bg-gray-800/60 px-4 py-2 rounded-2xl text-gray-300">Translation: GPT-3.5</span>
            <span className="text-xs bg-gray-800/60 px-4 py-2 rounded-2xl text-gray-300">AI: DeepSeek</span> */}
            <button
              onClick={() => setShowResearchModal(true)}
              className="text-xs bg-pink-600/80 hover:bg-pink-600 px-4 py-2 rounded-2xl text-white transition-colors flex items-center gap-2"
            >
              <span>📚</span> Research
            </button>
          </div>
        </div>
      </div>

      {/* Research Modal */}
      {showResearchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowResearchModal(false)}>
          <div className="bg-[#161B22] rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl border border-gray-800/60" onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Research Project: OpenSeek</h2>
                <button
                  onClick={() => setShowResearchModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6 text-gray-300">
                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-pink-500">Key Findings</h3>
                  <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 space-y-3">
                    <p>
                      During our research, we uncovered a significant finding regarding DeepSeek's censorship mechanisms.
                      The model implements an additional filtering layer that screens English responses to align with
                      specific ideological guidelines. However, we discovered that this censorship can be circumvented
                      by translating queries into Russian.
                    </p>
                    <p>
                      Unlike English responses, Russian outputs appear to bypass active censorship filters, though they
                      still exhibit certain inherent biases. This discovery highlights how AI models can be influenced
                      by external factors, even in open-source projects.
                    </p>
                    <p>
                      This insight raises important questions about AI transparency and the role of technology in
                      information access. Our findings emphasize the need for open discourse and unbiased information
                      distribution in the AI landscape.
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-pink-500">Overview</h3>
                  <p>
                    OpenSeek is an experimental project exploring the intersection of language translation and AI interactions.
                    It creates a unique pipeline where user input undergoes multiple transformations before reaching its final form.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-pink-500">Process Flow</h3>
                  <div className="bg-gray-800/30 rounded-2xl p-4 space-y-2">
                    <p>1. User Input (English) → GPT-3.5 Translation → Russian</p>
                    <p>2. Russian Text → DeepSeek AI Processing → Russian Response</p>
                    <p>3. Russian Response → GPT-3.5 Translation → English Output</p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-pink-500">Technology Stack</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Next.js 14 with TypeScript</li>
                    <li>OpenAI GPT-3.5 for translations</li>
                    <li>DeepSeek AI for processing</li>
                    <li>Real-time process visualization</li>
                    <li>Tailwind CSS for modern UI</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-pink-500">Research Goals</h3>
                  <p>
                    This project investigates how language translation affects AI responses and explores potential
                    differences in AI behavior when processing content in different languages. It also examines
                    the technical challenges of creating a seamless multi-step AI processing pipeline.
                  </p>
                  <p>
                    A key focus is understanding how language barriers and translation can influence AI censorship
                    mechanisms, potentially offering insights into creating more open and transparent AI systems.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-pink-500">Implications</h3>
                  <p>
                    Our findings have significant implications for AI development and deployment:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Highlights the importance of transparency in AI systems</li>
                    <li>Demonstrates how language processing can affect content filtering</li>
                    <li>Raises questions about the role of ideology in AI development</li>
                    <li>Emphasizes the need for unbiased information access</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold text-pink-500">Future Developments</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Support for additional languages</li>
                    <li>Comparative analysis of responses across languages</li>
                    <li>Integration of multiple AI models for comparison</li>
                    <li>Advanced analytics and response pattern analysis</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2 mt-10">Welcome to OpenSeek-R1</h2>
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
                        {message.role === 'user' ? 'You' : 'OpenSeek-R1'}
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
              className="flex-1 rounded-2xl bg-[#161B22] px-8 py-5 text-white placeholder-gray-400 border border-gray-800/60 focus:border-pink-500/50 focus:outline-none focus:ring-0 transition-colors shadow-lg hover:border-gray-700/60"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-pink-600/90 backdrop-blur-sm px-8 py-5 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-[#0E1117] disabled:bg-gray-700 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-pink-500/20"
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
                <span>Send</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 