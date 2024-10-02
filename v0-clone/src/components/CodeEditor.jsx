import React, { useState } from 'react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

function CodeEditor({ code, isLoading }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <div className="flex-1 p-4 bg-gray-800 text-white font-mono relative overflow-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            aria-label="Copy code"
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-white" />
            )}
          </button>
          <pre className="whitespace-pre-wrap">{code}</pre>
        </>
      )}
    </div>
  )
}

export default CodeEditor