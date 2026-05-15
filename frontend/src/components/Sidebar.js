import React from 'react';
import { HiPlus, HiChatAlt2, HiTrash } from 'react-icons/hi';
import useChat from '../hooks/useChat';

const Sidebar = () => {
  const { chats, currentChat, loadChat, newChat, deleteChat } = useChat();

  return (
    <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors">
      <div className="p-4">
        <button
          onClick={newChat}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-slate-700 dark:text-white font-medium"
        >
          <HiPlus /> New Chat
        </button>
      </div>

      <div className="flex-grow overflow-y-auto px-2 space-y-1">
        <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Chats</h3>
        {chats.length === 0 ? (
          <div className="px-3 py-4 text-sm text-slate-400 italic">No recent chats</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                currentChat?._id === chat._id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
              onClick={() => loadChat(chat._id)}
            >
              <div className="flex items-center gap-3 truncate">
                <HiChatAlt2 size={18} className="flex-shrink-0" />
                <span className="truncate text-sm font-medium">{chat.title}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-danger transition-opacity"
              >
                <HiTrash size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
          <p className="text-xs text-primary font-medium">Need Help?</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Check our policy documentation or search for FAQs.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
