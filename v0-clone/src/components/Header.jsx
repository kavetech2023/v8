import React from 'react';
import { BeakerIcon, Bars3Icon } from '@heroicons/react/24/solid';

function Header({ toggleSidebar }) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 text-gray-500 hover:text-gray-700">
            <Bars3Icon className="h-6 w-6" />
          </button>
          <BeakerIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="ml-2 text-2xl font-bold text-gray-900">v0 Clone</h1>
        </div>
        <nav className="flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-700">Docs</a>
          <a href="#" className="text-gray-500 hover:text-gray-700">Examples</a>
          <a href="#" className="text-gray-500 hover:text-gray-700">Blog</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;