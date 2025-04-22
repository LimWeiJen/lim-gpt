interface SidebarProps {
  conversations: Array<{
    id: number;
    title: string;
  }>;
  activeThreadId: number;
  onNewChat: () => void;
  onSelectThread: (id: number) => void;
  onDeleteThread: (id: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ 
  conversations, 
  activeThreadId, 
  onNewChat, 
  onSelectThread, 
  onDeleteThread,
  isCollapsed,
  onToggleCollapse 
}: SidebarProps) {
  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="collapse-button" 
        onClick={onToggleCollapse}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <div className="conversations-list">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conversation-item ${conv.id === activeThreadId ? 'active' : ''}`}
            title={conv.title}
          >
            <div 
              className="conversation-content"
              onClick={() => onSelectThread(conv.id)}
            >
              <svg 
                className="chat-icon" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
              <span className="conversation-title">
                {conv.title || `Conversation ${conv.id}`}
              </span>
            </div>
            <button 
              className="delete-button"
              onClick={() => onDeleteThread(conv.id)}
              title="Delete conversation"
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <button className="new-chat-button" onClick={onNewChat} title="New Chat">
          <svg 
            className="plus-icon" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
        
        <a 
          href="https://github.com/LimWeiJen/lim-gpt" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="github-link" 
          title="Visit My GitHub"
        >
          <svg 
            className="github-icon" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
          </svg>
        </a>
      </div>
    </div>
  );
}






