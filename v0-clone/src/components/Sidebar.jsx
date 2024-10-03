import React from 'react';
import UserInfo from './UserInfo';
import ChatHistory from './ChatHistory';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <UserInfo />
      <ChatHistory />
    </div>
  );
}

export default Sidebar;