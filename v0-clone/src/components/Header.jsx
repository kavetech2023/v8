import React from 'react'
import { BeakerIcon } from '@heroicons/react/24/solid'

function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
        <BeakerIcon className="h-8 w-8 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">v0 Clone</h1>
      </div>
    </header>
  )
}

export default Header