"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  MessageSquare,
  Sparkles,
  Bot,
  Loader2,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  module?: {
    title: string;
    orderIndex: number;
  };
};

type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    doubts: number;
  };
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeConversationId = searchParams.get("c") || "";

  // UI / Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isConversationsLoading, setIsConversationsLoading] = useState(true);

  // Rename conversation state
  const [editingConversationId, setEditingConversationId] = useState("");
  const [editingTitle, setEditingTitle] = useState("");

  // Input & Send states
  const [input, setInput] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  // Initialize voice input
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  // Fetch all conversations list on mount
  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/doubts/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsConversationsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Sync state with URL active conversation parameter
  useEffect(() => {
    if (activeConversationId) {
      loadConversationThread(activeConversationId);
    } else {
      setMessages([]);
      setSelectedModuleId("");
    }
  }, [activeConversationId]);

  // Load a single conversation thread
  const loadConversationThread = async (id: string) => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/doubts/conversations/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load conversation thread");
      }
      const data = await res.json();
      
      // Map doubts to messages
      const formattedMessages: Message[] = data.doubts.map((d: any) => ({
        id: d.id,
        role: "user" as const,
        content: d.question,
        createdAt: d.createdAt,
        module: d.module,
      })).flatMap((msg: Message, i: number) => {
        // Double map to match user + assistant model
        const assistantMsg: Message = {
          id: `${msg.id}-answer`,
          role: "assistant" as const,
          content: data.doubts[Math.floor(i / 2)].answer,
          createdAt: msg.createdAt,
          module: msg.module,
        };
        return i % 2 === 0 ? [msg, assistantMsg] : [];
      });

      // Filter out duplicate doubles and only push pairs
      const messageList: Message[] = [];
      data.doubts.forEach((d: any) => {
        messageList.push({
          id: `${d.id}-user`,
          role: "user",
          content: d.question,
          createdAt: d.createdAt,
          module: d.module,
        });
        messageList.push({
          id: `${d.id}-assistant`,
          role: "assistant",
          content: d.answer,
          createdAt: d.createdAt,
          module: d.module,
        });
      });

      setMessages(messageList);
      
      // Auto-set module context to the latest doubt's module context if available
      const latestDoubtWithModule = [...data.doubts].reverse().find((d: any) => d.moduleId);
      if (latestDoubtWithModule) {
        setSelectedModuleId(latestDoubtWithModule.moduleId);
      } else {
        setSelectedModuleId("");
      }
    } catch (err) {
      toast.error("Could not retrieve conversation thread");
      updateActiveConversationUrl("");
    } finally {
      setIsLoadingHistory(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  // Helper to adjust URL query parameter without page refresh
  const updateActiveConversationUrl = (id: string) => {
    const newUrl = id ? `/dashboard/doubts?c=${id}` : `/dashboard/doubts`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    // Trigger router query updates internally
    router.refresh();
  };

  // Handle setting active conversation
  const handleSelectConversation = (id: string) => {
    updateActiveConversationUrl(id);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Handle starting a fresh conversation session
  const handleNewChat = () => {
    updateActiveConversationUrl("");
    setMessages([]);
    setInput("");
    setSelectedModuleId("");
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    toast.success("Started a new conversation session");
  };

  // Handle Deleting a conversation
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const promise = fetch(`/api/doubts/conversations/${id}`, {
      method: "DELETE",
    }).then(async (res) => {
      if (!res.ok) throw new Error();
      
      // If deleted active thread, reset the workspace
      if (activeConversationId === id) {
        updateActiveConversationUrl("");
        setMessages([]);
      }
      
      // Update local state list
      setConversations((prev) => prev.filter((c) => c.id !== id));
      return true;
    });

    toast.promise(promise, {
      loading: "Deleting conversation...",
      success: "Conversation deleted successfully",
      error: "Failed to delete conversation",
    });
  };

  // Handle renaming a conversation
  const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConversationId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = async (id: string) => {
    if (!editingTitle.trim()) return;

    try {
      const res = await fetch(`/api/doubts/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });

      if (!res.ok) throw new Error();

      // Update local list state
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: editingTitle.trim() } : c))
      );
      setEditingConversationId("");
      toast.success("Conversation renamed");
    } catch (err) {
      toast.error("Failed to rename conversation");
    }
  };

  const handleCancelRename = () => {
    setEditingConversationId("");
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Dynamic textarea height adjustment
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice Recognition Handler
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
      adjustTextareaHeight();
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Could not capture voice input");
    };

    recognition.onend = () => {
      setIsListening(false);
      textareaRef.current?.focus();
    };

    setIsListening(true);
    recognition.start();
  };

  // Form submission handler
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
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

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          moduleId: selectedModuleId || undefined,
          conversationId: activeConversationId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get response");
      }

      // Check header for dynamic conversation ID
      const resConversationId = res.headers.get("X-Conversation-Id");
      if (resConversationId && activeConversationId !== resConversationId) {
        updateActiveConversationUrl(resConversationId);
        fetchConversations(); // refresh list in background
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

      // Sync active conversation updates
      fetchConversations();
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
      textareaRef.current?.focus();
    }
  };

  // Keyboard shortcut listener
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Group conversations by date
  const getGroupedConversations = () => {
    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    conversations.forEach((c) => {
      const date = new Date(c.updatedAt || c.createdAt);
      if (date >= today) {
        groups.Today.push(c);
      } else if (date >= yesterday) {
        groups.Yesterday.push(c);
      } else if (date >= sevenDaysAgo) {
        groups["Previous 7 Days"].push(c);
      } else {
        groups.Older.push(c);
      }
    });

    return groups;
  };

  const groupedConversations = getGroupedConversations();

  return (
    <div className="flex h-[calc(100vh-14rem)] w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 overflow-hidden relative shadow-2xl backdrop-blur-md">
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. COLLAPSIBLE LEFT SIDEBAR HISTORY PANEL */}
      <aside
        className={cn(
          "bg-zinc-900/60 border-r border-zinc-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out z-40",
          "md:relative md:translate-x-0 absolute inset-y-0 left-0 w-72 md:w-64 lg:w-72 h-full",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-full md:w-0 md:border-r-0"
        )}
      >
        {/* Sidebar Header with New Chat */}
        <div className="p-4 border-b border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              Doubt Workspace
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg md:hidden"
              title="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl transition-all duration-200 text-sm shadow-[0_0_12px_rgba(255,255,255,0.05)] border border-transparent hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Chat
          </button>
        </div>

        {/* History Grouped List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
          {isConversationsLoading ? (
            <div className="flex flex-col gap-2 p-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-full bg-zinc-800/40 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-xs text-zinc-500">No previous doubt history.</p>
            </div>
          ) : (
            Object.entries(groupedConversations).map(([groupName, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={groupName} className="space-y-1">
                  <h4 className="px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    {groupName}
                  </h4>
                  <div className="space-y-0.5">
                    {items.map((c) => {
                      const isActive = activeConversationId === c.id;
                      const isEditing = editingConversationId === c.id;

                      return (
                        <div
                          key={c.id}
                          onClick={() => !isEditing && handleSelectConversation(c.id)}
                          className={cn(
                            "group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer outline-none relative select-none",
                            isActive
                              ? "bg-zinc-800/80 text-white shadow-inner border border-zinc-700/50"
                              : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <MessageSquare className={cn(
                              "w-3.5 h-3.5 shrink-0 transition-colors",
                              isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"
                            )} />
                            
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveRename(c.id);
                                  if (e.key === "Escape") handleCancelRename();
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 bg-zinc-950 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                              />
                            ) : (
                              <span className="truncate pr-4 select-none">
                                {c.title}
                              </span>
                            )}
                          </div>

                          {/* Action Hover Controls */}
                          <div className="flex items-center gap-1 shrink-0">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveRename(c.id);
                                  }}
                                  className="p-1 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 rounded"
                                  title="Save title"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelRename();
                                  }}
                                  className="p-1 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 rounded"
                                  title="Cancel rename"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
                                <button
                                  onClick={(e) => handleStartRename(c.id, c.title, e)}
                                  className="p-1 hover:bg-zinc-800 hover:text-cyan-400 rounded text-zinc-500 transition-colors"
                                  title="Rename conversation"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteConversation(c.id, e)}
                                  className="p-1 hover:bg-zinc-800 hover:text-rose-500 rounded text-zinc-500 transition-colors"
                                  title="Delete conversation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/20 text-center">
          <span className="text-[10px] text-zinc-600 font-medium">
            Be10X Learner Support · 2026
          </span>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE / CHAT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative h-full">
        {/* Workspace Toolbar Header */}
        <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-4 shrink-0 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle control */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-colors outline-none focus:ring-1 focus:ring-cyan-500/30"
                title="Expand history sidebar"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="hidden md:flex p-2 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-colors outline-none focus:ring-1 focus:ring-cyan-500/30"
                title="Collapse history sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl transition-colors outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Conversation Active Info */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
              <h2 className="text-xs font-semibold text-zinc-300 truncate max-w-44 md:max-w-72">
                {activeConversationId
                  ? conversations.find((c) => c.id === activeConversationId)?.title || "Active Discussion"
                  : "New Conversation"}
              </h2>
            </div>
          </div>

          {/* Module Selector Context */}
          {modules.length > 0 && (
            <div className="shrink-0 max-w-xs md:max-w-sm">
              <label htmlFor="doubt-module-select" className="sr-only">
                Module selector
              </label>
              <select
                id="doubt-module-select"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-50 transition-colors"
              >
                <option value="" className="bg-zinc-900">
                  General Learning Scope
                </option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id} className="bg-zinc-900">
                    M{module.orderIndex}: {module.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        {/* Dynamic Messages Log Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 scrollbar-thin select-text"
          role="log"
          aria-label="Thread messages log"
        >
          {/* Thread Loader Skeleton */}
          {isLoadingHistory ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={cn("flex gap-4 w-full", i % 2 === 0 ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[75%] rounded-2xl p-4 animate-pulse bg-zinc-900 border border-zinc-800/60 w-80", i % 2 === 0 ? "bg-white/5 border-white/5" : "")}>
                    <div className="h-3 bg-zinc-800 rounded w-1/4 mb-3" />
                    <div className="h-2 bg-zinc-800 rounded w-full mb-2" />
                    <div className="h-2 bg-zinc-800 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 && !isLoading ? (
            /* Immersive Workspace Empty State */
            <div className="flex flex-col items-center justify-center min-h-full max-w-xl mx-auto text-center px-4 py-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl" />
                <div className="relative flex items-center justify-center w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                Be10X Workshop AI doubts resolution
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-8 max-w-sm">
                Get immediate solutions, code scripts, or prompt examples relating to the Be10X course modules. Your answers are stored automatically.
              </p>

              {/* Quick Suggestion Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-left">
                {[
                  {
                    title: "Explain Prompt Engineering",
                    desc: "What is role prompting with examples?",
                    prompt: "Can you explain prompt engineering and show an example of 'role prompting' for workshop professionals?",
                  },
                  {
                    title: "AI data summaries",
                    desc: "How do I summarize spreadsheets?",
                    prompt: "How can I use ChatGPT/AI tools to summarize long data sheets and extract insights easily?",
                  },
                  {
                    title: "Create automation scripts",
                    desc: "Excel automation ideas",
                    prompt: "What are some practical AI workflows to automate email replies or Excel macros?",
                  },
                  {
                    title: "Summarization tools",
                    desc: "Summarize PDF documents",
                    prompt: "Which AI tools are best for summarizing long PDF reports or business contracts?",
                  },
                ].map((s) => (
                  <div
                    key={s.title}
                    onClick={() => {
                      setInput(s.prompt);
                      textareaRef.current?.focus();
                    }}
                    className="p-3.5 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700/80 rounded-xl hover:bg-zinc-900/80 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {s.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1 leading-snug">
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Chat message rows */
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-4 w-full transition-all duration-300",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {/* Bot icon avatar */}
                    {!isUser && (
                      <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-md">
                        <Bot className="w-4.5 h-4.5 text-cyan-400" />
                      </div>
                    )}

                    {/* Bubble body */}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed relative border shadow-sm",
                        isUser
                          ? "bg-white text-black border-transparent font-medium"
                          : "bg-zinc-900/80 border-zinc-800/80 text-zinc-200"
                      )}
                    >
                      {/* Module Badge context in header */}
                      {!isUser && msg.module && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
                          <BookOpen className="w-2.5 h-2.5" />
                          Module {msg.module.orderIndex}: {msg.module.title}
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">
                        {msg.content || (
                          /* 3-dot typing visualizer */
                          <span className="inline-flex items-center gap-1.5 py-1 px-1.5">
                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s] shadow-[0_0_4px_#22d3ee]" />
                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s] shadow-[0_0_4px_#22d3ee]" />
                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce shadow-[0_0_4px_#22d3ee]" />
                          </span>
                        )}
                      </p>
                    </div>

                    {/* User initial avatar */}
                    {isUser && (
                      <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-inner">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase">
                          Me
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Workspace Bottom Inputs Bar */}
        <footer className="p-4 border-t border-zinc-900 bg-zinc-950 shrink-0">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={(e) => handleSubmit(e)} className="relative flex items-end">
              <label htmlFor="workspace-chat-input" className="sr-only">
                Ask Be10X AI doubt assistant
              </label>
              
              <textarea
                ref={textareaRef}
                id="workspace-chat-input"
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Be10X AI..."
                disabled={isLoading}
                className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl pl-4 pr-24 py-3.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-50 resize-none max-h-36 overflow-y-auto scrollbar-none shadow-inner leading-relaxed transition-all duration-200"
              />

              {/* Float Right Action Controls */}
              <div className="absolute right-2 bottom-2 flex gap-1.5 items-center">
                {/* Voice button */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  aria-pressed={isListening}
                  title={isListening ? "Stop voice transcription" : "Speak to write doubt"}
                  className={cn(
                    "p-2 text-sm font-medium rounded-xl transition-all duration-200 outline-none hover:scale-105 active:scale-95 shrink-0 border",
                    isListening
                      ? "bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                  )}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  title="Send doubt to Be10X AI"
                  className={cn(
                    "p-2 text-sm font-medium rounded-xl transition-all duration-200 outline-none hover:scale-105 active:scale-95 shrink-0 border shadow-md",
                    input.trim()
                      ? "bg-white hover:bg-zinc-200 text-black border-transparent"
                      : "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed"
                  )}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>

            {/* Keyboard tips bar */}
            <div className="flex justify-between items-center px-2 mt-2">
              <span className="text-[10px] text-zinc-600">
                Shift + Enter for new line · Enter to send
              </span>
              <span className="text-[9px] text-zinc-600 font-bold tracking-wide uppercase select-none">
                Groq Llama 3.3 Versatile Active
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
