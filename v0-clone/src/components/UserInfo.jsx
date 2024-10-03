import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

function UserInfo() {
  return (
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center">
        <UserCircleIcon className="h-10 w-10 text-gray-300" />
        <div className="ml-3">
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-gray-400">john@example.com</p>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;