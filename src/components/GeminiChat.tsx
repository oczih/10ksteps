'use client';

import { useState, useRef, useEffect } from 'react';
import { sendPrompt } from '@/app/services/aiservice';
import { scanForCoordinates, Coordinate } from '@/lib/coordinate-parser';
import { useRoute } from '@/app/context/RouteContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  coordinates?: Coordinate[];
}

interface ApiError {
  message: string;
}

export default function GeminiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingToMap, setSendingToMap] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { addCoordinatesFromGemini } = useRoute();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    
    const userMessage: Message = {
      text: prompt,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const result = await sendPrompt(prompt, messages.map(m => m.text));
      
      const coordinateResult = scanForCoordinates(result);
      
      const aiMessage: Message = {
        text: result,
        isUser: false,
        timestamp: new Date(),
        coordinates: coordinateResult.coordinates
      };
      setMessages(prev => [...prev, aiMessage]);
      
      if (coordinateResult.hasCoordinates) {
        console.log('Found coordinates:', coordinateResult.coordinates);
      }
      
    } catch (err) {
      const error = err as ApiError;
      const errorMessage: Message = {
        text: `Error: ${error.message}`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleChatClear = () => {
    setMessages([]);
    setPrompt('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl border border-blue-200 w-96 h-[32rem] flex flex-col overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            {/* Animated background shapes */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute w-40 h-40 bg-blue-200 opacity-30 rounded-full blur-2xl animate-pulse-slow top-[-3rem] left-[-3rem]" />
              <div className="absolute w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-2xl animate-pulse-slower bottom-[-2rem] right-[-2rem]" />
            </div>
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-blue-500 text-white rounded-t-2xl z-10">
              <h3 className="font-semibold">AI Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-600 rounded-full p-1 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-blue-400 opacity-70 select-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-lg font-semibold">Ask me about walking routes, places, or steps!</p>
                  <p className="text-sm">Try: <span className="italic">&quot;Suggest a scenic walk in Lauttasaari&quot;</span></p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.isUser ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {/* Only show coordinates if found, do not show AI's descriptive text */}
                        {message.coordinates && message.coordinates.length > 0 && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                            <p className="font-semibold text-green-800">📍 Found {message.coordinates.length} coordinate(s):</p>
                            <p className="text-green-700 font-mono text-xs">
                              {message.coordinates.map((coord, idx) => 
                                `[${coord.latitude}, ${coord.longitude}]${idx < message.coordinates!.length - 1 ? ', ' : ''}`
                              )}
                            </p>
                            <button
                              onClick={async () => {
                                setSendingToMap(true);
                                addCoordinatesFromGemini(message.coordinates!);
                                // Small delay to show the loading state
                                setTimeout(() => setSendingToMap(false), 1000);
                              }}
                              disabled={sendingToMap}
                              className={`mt-2 px-3 py-1 text-xs rounded transition-colors ${
                                sendingToMap 
                                  ? 'bg-gray-400 cursor-not-allowed' 
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              }`}
                            >
                              {sendingToMap ? '🔄 Sending...' : '🗺️ Send to Map'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-bounce">●</div>
                  <div className="animate-bounce delay-100">●</div>
                  <div className="animate-bounce delay-200">●</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 resize-none rounded-lg border text-black p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  disabled={loading}
                />
                <button
                  onClick={handleAsk}
                  disabled={loading || !prompt.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    loading || !prompt.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors duration-200`}
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={handleChatClear}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.15); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}