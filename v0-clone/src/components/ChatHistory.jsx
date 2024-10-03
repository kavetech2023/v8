import React from 'react';
import { useAppContext } from '../contexts/AppContext';

function ChatHistory() {
  const { chatHistory } = useAppContext();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      <ul className="space-y-2">
        {chatHistory.map((chat) => (
          <li
            key={chat.id}
            className={`p-2 rounded-md text-sm ${
              chat.isUser ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            {chat.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatHistory;