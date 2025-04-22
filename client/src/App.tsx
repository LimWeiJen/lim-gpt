// App.tsx
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import Markdown from 'react-markdown';
import { Sidebar } from './components/Sidebar';

// Define the structure of a message
interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  threadId: number;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

// Local storage keys
const STORAGE_KEYS = {
  CONVERSATIONS: 'limgpt_conversations',
  ACTIVE_THREAD: 'limgpt_active_thread'
};

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<number>(Date.now());
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiUrl = "https://0f7aa789-a572-46ca-848f-7767a70a43cd.us-east-1.cloud.genez.io";

  // Load saved conversations and active thread from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    const savedActiveThread = localStorage.getItem(STORAGE_KEYS.ACTIVE_THREAD);

    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    } else {
      // Create initial conversation if no saved data
      const initialConversation = {
        id: Date.now(),
        title: 'New Chat',
        messages: []
      };
      setConversations([initialConversation]);
    }

    if (savedActiveThread) {
      setActiveThreadId(Number(savedActiveThread));
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save active thread to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_THREAD, activeThreadId.toString());
  }, [activeThreadId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [conversations]);

  const handleNewChat = () => {
    const newThreadId = Date.now();
    setConversations(prev => [...prev, {
      id: newThreadId,
      title: 'New Chat',
      messages: []
    }]);
    setActiveThreadId(newThreadId);
    setInputValue('');
    setError(null);
  };

  const addMessage = (threadId: number, role: 'user' | 'assistant', content: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === threadId) {
        const newMessage = {
          id: Date.now() + Math.random(),
          role,
          content: content.trim(),
          threadId
        };
        
        // Update conversation title with first user message
        const isFirstMessage = conv.messages.length === 0 && role === 'user';
        return {
          ...conv,
          title: isFirstMessage ? content.slice(0, 30) + '...' : conv.title,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));
  };

  const handleSendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    const userMessage = inputValue.trim();
    if (!userMessage || isLoading) return;

    if (!apiUrl) {
      setError("API URL is not configured. Please set VITE_API_URL environment variable.");
      return;
    }

    addMessage(activeThreadId, 'user', userMessage);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          thread_id: activeThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const assistantResponse = await response.text();
      addMessage(activeThreadId, 'assistant', assistantResponse.replace(/^"|"$/g, ''));

    } catch (err) {
      console.error("Failed to fetch response:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const activeConversation = conversations.find(conv => conv.id === activeThreadId);

  const handleDeleteThread = (threadId: number) => {
    setConversations(prev => {
      const updatedConversations = prev.filter(conv => conv.id !== threadId);
      
      // If no conversations left, create a new one
      if (updatedConversations.length === 0) {
        const newConversation = {
          id: Date.now(),
          title: 'New Chat',
          messages: []
        };
        return [newConversation];
      }
      return updatedConversations;
    });
    
    // If the deleted thread was active, switch to another thread
    if (threadId === activeThreadId) {
      const remainingThreads = conversations.filter(conv => conv.id !== threadId);
      if (remainingThreads.length > 0) {
        setActiveThreadId(remainingThreads[0].id);
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        activeThreadId={activeThreadId}
        onNewChat={handleNewChat}
        onSelectThread={setActiveThreadId}
        onDeleteThread={handleDeleteThread}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="chat-window">
        {!activeConversation && (
          <div className="welcome-container">
            <div className="lim-gpt-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </div>
              <div className="logo-text">
                <span className="lim">Lim</span>
                <span className="gpt">GPT</span>
              </div>
            </div>
            <p className="welcome-text">Select a conversation or start a new one.</p>
          </div>
        )}
        {activeConversation?.messages.length === 0 && (
          <div className="welcome-container">
            <div className="lim-gpt-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </div>
              <div className="logo-text">
                <span className="lim">Lim</span>
                <span className="gpt">GPT</span>
              </div>
            </div>
            <p className="welcome-text">How can I assist you today?</p>
          </div>
        )}
        <div className="message-list" ref={messageListRef}>
          {activeConversation?.messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}-message`}>
              {msg.content.split("\\n").map((line, index) => <span key={index}><Markdown>{line}</Markdown></span>)}
            </div>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="input-area" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <svg className="send-icon" style={{ width: '18px', height: '18px', display: 'flex', margin: 'auto' }} viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;





