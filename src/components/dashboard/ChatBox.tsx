"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Mic, MicOff } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ModuleOption = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export function ChatBox({ modules = [] }: { modules?: ModuleOption[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      toast.error("Voice input is not supported in this browser");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Could not capture voice input");
    };

    recognition.onend = () => {
      setIsListening(false);
      inputRef.current?.focus();
    };

    setIsListening(true);
    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          moduleId: selectedModuleId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get response");
      }

      if (!res.body) {
        throw new Error("Failed to get response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedAnswer = "";

      while (true) {
        const { done, value } = await reader.read();
        const chunk = decoder.decode(value, { stream: !done });

        if (chunk) {
          streamedAnswer += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: streamedAnswer }
                : msg
            )
          );
        }

        if (done) break;
      }

      const remainingChunk = decoder.decode();
      if (remainingChunk) {
        streamedAnswer += remainingChunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: streamedAnswer }
              : msg
          )
        );
      }

      if (!streamedAnswer.trim()) {
        throw new Error("Failed to get response");
      }
    } catch (err) {
      const content =
        err instanceof Error && err.message !== "Failed to get response"
          ? err.message
          : "Something went wrong. Please try again.";

      toast.error("Could not get an answer", {
        description: content,
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, content } : msg
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] max-w-3xl mx-auto">
      {modules.length > 0 && (
        <div className="mb-4">
          <label htmlFor="doubt-module" className="sr-only">
            Module context
          </label>
          <select
            id="doubt-module"
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            disabled={isLoading}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
          >
            <option value="" className="bg-zinc-900">
              General course question
            </option>
            {modules.map((module) => (
              <option key={module.id} value={module.id} className="bg-zinc-900">
                Module {module.orderIndex}: {module.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2"
        role="log"
        aria-label="Chat messages"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-sm">
              <h3 className="text-base font-medium text-white mb-1">
                Ask your first question
              </h3>
              <p className="text-sm text-zinc-500">
                Type a question about the course content below. Your doubts are saved automatically for future reference.
              </p>
              <p className="text-xs text-zinc-600 mt-3">
                Powered by AI · Answers saved automatically
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-white text-black"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-200"
              }`}
            >
              <p className="whitespace-pre-wrap">
                {msg.content || (
                  <span className="inline-flex items-center gap-2 text-zinc-400">
                    <span className="inline-block w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" />
                    Thinking...
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 pt-4 border-t border-zinc-800"
      >
        <label htmlFor="doubt-input" className="sr-only">
          Ask a question
        </label>
        <input
          ref={inputRef}
          id="doubt-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          disabled={isLoading}
          aria-pressed={isListening}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          className={`px-4 py-3 text-sm font-medium rounded-lg border transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 ${
            isListening
              ? "bg-red-500/10 text-red-300 border-red-500/30"
              : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
