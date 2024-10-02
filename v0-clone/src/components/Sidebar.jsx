import React, { useState } from 'react'

function Sidebar({ onGenerateCode, previousQueries }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerateCode(prompt)
    setPrompt('')
  }

  return (
    <div className="w-64 bg-gray-200 p-4 flex flex-col">
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your component..."
          className="w-full p-2 mb-2 border rounded"
          rows={4}
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Generate Code
        </button>
      </form>
      <div className="mt-4 flex-grow overflow-auto">
        <h3 className="font-semibold mb-2">Conversation History:</h3>
        <ul className="space-y-2">
          {previousQueries.map((query, index) => (
            <li
              key={index}
              className="text-sm bg-white p-2 rounded shadow"
            >
              {query}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar