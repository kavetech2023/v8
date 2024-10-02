import React, { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'

function App() {
  const [generatedResponses, setGeneratedResponses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [previousQueries, setPreviousQueries] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null)

  const handleCodeGeneration = async (prompt) => {
    setIsLoading(true)
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      const context = previousQueries.length > 0 ? `Previous query: ${previousQueries[previousQueries.length - 1]}. ` : ''

      const result = await model.generateContent(`
        ${context}Generate a React component based on the following description:
        ${prompt}
        
        Please provide only the component code without any explanations.
        The component should be a function named 'Component' that returns JSX.
        Use Tailwind CSS for styling.
        Here's an example of the expected format:

        function Component() {
          return (
            <div className="...">
              {/* Component content */}
            </div>
          )
        }

        Make the code as simple as possible. Follow best practices and best design patterns for the top websites in the world.
        Do not include any comments.Make it responsive
      `)

      const generatedText = result.response.text()
      
      const newResponse = {
        prompt,
        code: generatedText,
        explanation: generateExplanation(generatedResponses[0]?.code, generatedText)
      }

      setGeneratedResponses(prevResponses => [newResponse, ...prevResponses])
      setPreviousQueries(prevQueries => [...prevQueries, prompt])
    } catch (error) {
      console.error('Error generating code:', error)
      setGeneratedResponses(prevResponses => [
        { prompt, code: 'Error generating code. Please try again.', explanation: 'An error occurred.' },
        ...prevResponses
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const generateExplanation = (previousCode, newCode) => {
    if (!previousCode) return "Initial generation."
    
    const differences = []
    if (previousCode.length !== newCode.length) {
      differences.push("The overall structure has changed.")
    }
    if (previousCode.includes('className') !== newCode.includes('className')) {
      differences.push("The styling approach has been modified.")
    }
    if (previousCode.split('\n').length !== newCode.split('\n').length) {
      differences.push("The component's complexity has changed.")
    }

    return differences.length > 0 
      ? `Changes: ${differences.join(' ')}`
      : "Minor modifications were made."
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onGenerateCode={handleCodeGeneration} previousQueries={previousQueries} />
        <main className="flex-1 flex flex-col overflow-auto">
          {generatedResponses.map((response, index) => (
            <div key={index} className={`border-b border-gray-200 ${expandedIndex === index ? 'flex-grow' : ''}`}>
              <div className="flex justify-between items-center p-2 bg-gray-50">
                <h3 className="font-semibold">Response {generatedResponses.length - index}</h3>
                <button 
                  onClick={() => toggleExpand(index)} 
                  className="text-blue-500 hover:text-blue-700"
                >
                  {expandedIndex === index ? 'Collapse' : 'Expand'}
                </button>
              </div>
              <div className={`flex ${expandedIndex === index ? 'flex-col' : 'h-64'}`}>
                <CodeEditor code={response.code} isLoading={isLoading && index === 0} />
                <Preview code={response.code} explanation={response.explanation} />
              </div>
            </div>
          ))}
        </main>
        
      </div>
      
    </div>
  )
}

export default App