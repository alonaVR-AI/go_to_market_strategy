'use client';

import { useChat } from 'ai/react';
import { 
  ArrowUpRight, 
  Globe, 
  Lightbulb,
  Mic, 
  MoreHorizontal, 
  Plus, 
  Send,
  Loader2,
  User,
  Bot
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import type { ReactNode } from 'react';
import ClientOnly from './ClientOnly';
import PlayTTSButton from './PlayTTSButton';
import 'highlight.js/styles/github-dark.css';

const sampleQuestions = [
  "I want to sell handmade jewelry",
  "I have a new fitness app",
  "I'm launching a pet food brand"
];

interface ComponentProps {
  node?: any;
  children?: ReactNode;
  [key: string]: any;
}

interface CodeProps extends ComponentProps {
  inline?: boolean;
  className?: string;
}

const components: Components = {
  h1: ({ children, ...props }: ComponentProps) => (
    <h1 className="text-3xl font-bold text-blue-300 mb-6 mt-8" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentProps) => (
    <h2 className="text-2xl font-semibold text-blue-300 mb-4 mt-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentProps) => (
    <h3 className="text-xl font-semibold text-blue-300 mb-3 mt-5" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ComponentProps) => (
    <p className="text-lg leading-relaxed mb-4 whitespace-pre-wrap" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: ComponentProps) => (
    <ul className="text-lg list-disc list-inside space-y-4 mb-6 ml-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentProps) => (
    <ol className="text-lg list-decimal list-inside space-y-4 mb-6 ml-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentProps) => (
    <li className="text-lg marker:text-blue-300" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }: ComponentProps) => (
    <strong className="font-semibold text-blue-300" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: ComponentProps) => (
    <em className="italic text-blue-200" {...props}>
      {children}
    </em>
  ),
  code: ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline ? (
      <pre className="bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto">
        <code
          className={`${match ? `language-${match[1]}` : ''} text-sm font-mono text-gray-100`}
          {...props}
        >
          {children}
        </code>
      </pre>
    ) : (
      <code
        className="bg-gray-800 text-blue-400 px-1.5 py-0.5 rounded font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: ({ children, ...props }: ComponentProps) => (
    <blockquote
      className="border-l-4 border-blue-400/40 pl-4 italic text-gray-300 my-4"
      {...props}
    >
      {children}
    </blockquote>
  ),
  a: ({ children, ...props }: ComponentProps) => (
    <a
      className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
      {...props}
    >
      {children}
    </a>
  ),
  hr: ({ ...props }: ComponentProps) => (
    <hr className="border-white/10 my-6" {...props} />
  ),
  table: ({ children, ...props }: ComponentProps) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: ComponentProps) => (
    <th className="border border-white/10 bg-[#1E1E1E] px-4 py-2 text-left font-semibold text-[#FFB5C9]" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentProps) => (
    <td className="border border-white/10 px-4 py-2 text-white/90" {...props}>
      {children}
    </td>
  ),
};

function formatMessage(content: string): string {
  // Add emojis and formatting to numbered lists while preserving numbers with content
  return content
    // Format the initial greeting
    .replace(/^That's great, congratulations!/m, '🎉 **Fantastic News!**')
    // Format the introduction paragraph
    .replace(/^A SaaS \(Software as a Service\) platform/m, '💡 A SaaS (Software as a Service) platform')
    // Format the steps introduction
    .replace(/^To make the most of your new platform/m, '\n**To make the most of your new platform**')
    // Format numbered items while keeping numbers with content
    .replace(/^(\d+)\.\s*([^\n]+)$/gm, (_, number: string, text: string) => {
      const emojis: Record<string, string> = {
        '1': '🎯',
        '2': '📢',
        '3': '🎁',
        '4': '👥',
        '5': '📈',
        '6': '📚',
        '7': '🤝'
      };
      return `${emojis[number] || '•'} ${number}. ${text}`;
    })
    // Add spacing between sections
    .replace(/\n(\d+\.)/g, '\n\n$1');
}

function ChatContent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [],
    id: 'chat',
    api: '/api/openai/chat'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleQuestionClick = (question: string) => {
    handleInputChange({ target: { value: question } } as any);
    handleSubmit({ preventDefault: () => {} } as any);
  };

  return (
    <main className="min-h-screen bg-gray-900 relative">
      <div className="container mx-auto max-w-4xl px-8 flex flex-col min-h-screen">
        <div className="flex-1 rounded-2xl bg-gray-800 border border-gray-700 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center relative">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-blue-500/10 rounded-bl-full" />
                <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-blue-500/10 rounded-tr-full" />
              </div>
              <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto pt-16 pb-8 px-8">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl text-white mb-4 font-bold leading-tight">
                    👋 Hi there, I&apos;m your<br />go-to-market strategy assistant
                  </h1>
                  <p className="text-xl text-blue-400 max-w-2xl font-medium">
                    🚀 I&apos;m here to help you turn your business idea into a real-world success
                  </p>
                </div>

                <div className="w-full max-w-2xl space-y-8">
                  <div className="text-center">
                    <p className="text-lg text-gray-100 leading-relaxed">
                      By the end of this conversation, you will have a comprehensive<br />go-to-market strategy for your product or service.
                    </p>
                  </div>

                  <div className="text-left space-y-4">
                    <p className="text-xl text-blue-400 font-semibold">📍 We&apos;ll go through these key stages:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                        <div className="text-base text-gray-100">💡 1. Your Idea/Product & Target Market</div>
                        <div className="text-base text-gray-100">🔍 2. Market Research</div>
                        <div className="text-base text-gray-100">👥 3. Customer Segments</div>
                        <div className="text-base text-gray-100">🎯 4. Product Positioning</div>
                      </div>
                      <div className="space-y-2.5">
                        <div className="text-base text-gray-100">📢 5. Channel Strategy</div>
                        <div className="text-base text-gray-100">📋 6. GTM Execution Plan</div>
                        <div className="text-base text-gray-100">💰 7. Budget & Metrics</div>
                        <div className="text-base text-gray-100">🏆 8. Final Go-to-market strategy</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-lg text-gray-100">
                      🤔 To start, could you tell me which product or service you&apos;re planning to take to market?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-6 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-700`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Bot className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div className={`flex-1 px-6 py-4 rounded-xl text-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 prose prose-invert max-w-none">
                        <ReactMarkdown 
                          components={components}
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {message.role === 'assistant' ? formatMessage(message.content) : message.content}
                        </ReactMarkdown>
                      </div>
                      {message.role === 'assistant' && (
                        <PlayTTSButton text={message.content} className="flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="px-8 py-6">
          <form 
            onSubmit={handleSubmit}
            className="flex items-center justify-center gap-4 bg-gray-800 rounded-2xl border border-gray-700 p-4 w-full max-w-3xl mx-auto shadow-lg"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none px-4 py-2 text-lg text-white placeholder:text-gray-500"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-xl transition-colors ${
                isLoading || !input.trim()
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </form>

          {messages.length === 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-3xl mx-auto">
              {sampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="px-6 py-2.5 bg-gray-800/50 text-base font-medium text-gray-100 rounded-full border border-gray-700 hover:bg-gray-800 hover:border-blue-500/50 transition-all duration-200 shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Chat() {
  return (
    <ClientOnly>
      <ChatContent />
    </ClientOnly>
  );
}