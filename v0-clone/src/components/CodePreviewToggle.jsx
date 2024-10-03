import React, { useState, useEffect } from 'react';
import { LightBulbIcon, CodeBracketIcon, ClipboardIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useAppContext } from '../contexts/AppContext';

function CodePreviewToggle() {
  const [selectedTab, setSelectedTab] = useState('preview');
  const { currentCode, codeHistory, generateCode } = useAppContext();
  const [copiedCode, setCopiedCode] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [previewContent, setPreviewContent] = useState(null);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const handleGenerateCode = () => {
    generateCode(prompt);
    setPrompt('');
  };

  const renderPreviewComponent = (code) => {
    try {
      // Remove any import statements and React-specific syntax
      const strippedCode = code
        .replace(/import\s+.*?;/g, '')
        .replace(/export\s+default\s+.*?;?/g, '')
        .replace(/function\s+Component\s*\([^)]*\)\s*{/, '')
        .replace(/return\s*\(/g, '')
        .replace(/\);?\s*}$/g, '');

      // Extract JSX content
      const jsxContent = strippedCode.trim();

      // Create a new function that returns the JSX content
      const ComponentFunction = new Function('React', `return function() { return (${jsxContent}) }`);

      // Call the function with React as an argument and render the returned component
      const RenderedComponent = ComponentFunction(React);
      return <RenderedComponent />;
    } catch (error) {
      console.error('Error rendering preview:', error);
      return <div className="text-red-500">Error rendering preview: {error.message}</div>;
    }
  };

  useEffect(() => {
    if (currentCode) {
      try {
        // Remove 'const' declarations and replace with 'var'
        const modifiedCode = currentCode.replace(/const\s+/g, 'var ');
        setPreviewContent(renderPreviewComponent(modifiedCode));
      } catch (error) {
        console.error('Error in useEffect:', error);
        setPreviewContent(<div className="text-red-500">Error rendering preview: {error.message}</div>);
      }
    }
  }, [currentCode]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex p-1 space-x-1 bg-indigo-900/20 rounded-xl">
        <button
          onClick={() => setSelectedTab('preview')}
          className={`w-full py-2.5 text-sm leading-5 font-medium rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white ring-opacity-60 ${
            selectedTab === 'preview' ? 'bg-white shadow text-indigo-700' : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center">
            <LightBulbIcon className="w-5 h-5 mr-2" />
            Preview
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('code')}
          className={`w-full py-2.5 text-sm leading-5 font-medium rounded-lg focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white ring-opacity-60 ${
            selectedTab === 'code' ? 'bg-white shadow text-indigo-700' : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center">
            <CodeBracketIcon className="w-5 h-5 mr-2" />
            Code
          </div>
        </button>
      </div>
      <div className="flex-1 mt-2">
        {selectedTab === 'preview' ? (
          <div className="h-full bg-white rounded-xl p-3 overflow-auto">
            <div className="h-full flex items-center justify-center">
              {previewContent ? (
                previewContent
              ) : (
                <div className="text-gray-400">No preview available</div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full bg-gray-100 rounded-xl p-3 overflow-auto">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter code generation prompt"
                  className="flex-grow p-2 border rounded-md"
                />
                <button
                  onClick={handleGenerateCode}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Generate
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Current Code</h3>
                  <button
                    onClick={() => copyToClipboard(currentCode, 'current')}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {copiedCode === 'current' ? (
                      <ClipboardDocumentCheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <SyntaxHighlighter language="javascript" style={docco}>
                  {currentCode}
                </SyntaxHighlighter>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Code History</h3>
                {codeHistory.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium">{item.prompt}</h4>
                      <button
                        onClick={() => copyToClipboard(item.code, item.id)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {copiedCode === item.id ? (
                          <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        ) : (
                          <ClipboardIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <SyntaxHighlighter language="javascript" style={docco}>
                      {item.code}
                    </SyntaxHighlighter>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodePreviewToggle;