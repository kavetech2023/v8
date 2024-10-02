import React, { useState, useEffect } from 'react'

export default function Preview({ code, explanation }) {
  const [error, setError] = useState(null)
  const [PreviewComponent, setPreviewComponent] = useState(null)

  useEffect(() => {
    setError(null)
    setPreviewComponent(null)

    if (!code) return

    try {
      // Create a sandboxed environment
      const sandboxEnv = {
        React: React,
        Component: null,
      }

      // Preprocess the code to remove JSX and handle dot notation
      const processedCode = code.replace(/</g, 'React.createElement(')
                                .replace(/\/>/g, ')')
                                .replace(/>\s*([^<]*)\s*</g, ', `$1`)')
                                .replace(/\s+([a-zA-Z0-9_]+)=/g, ' "$1":')
                                .replace(/\s+className=/g, ' className:')
                                .replace(/(\w+)\.(\w+)/g, '["$1"]["$2"]')

      // Add closing parentheses to match opening ones
      const balancedCode = processedCode.replace(/React\.createElement\(/g, (match, offset, string) => {
        let count = 1;
        let i = offset + match.length;
        while (count > 0 && i < string.length) {
          if (string[i] === '(') count++;
          if (string[i] === ')') count--;
          i++;
        }
        return count > 0 ? match + ')'.repeat(count) : match;
      });

      // Ensure all React.createElement calls are properly closed
      const finalCode = balancedCode.replace(/React\.createElement\((.*?)(?:\)*)$/g, (match, p1) => {
        const openParens = (match.match(/\(/g) || []).length;
        const closeParens = (match.match(/\)/g) || []).length;
        const missingParens = openParens - closeParens;
        return `${match}${')'.repeat(Math.max(0, missingParens))}`;
      });

      // Evaluate the code in the sandboxed environment
      const evaluatedCode = new Function('sandbox', `
        with (sandbox) {
          ${finalCode}
          return Component;
        }
      `)

      const ComponentFunction = evaluatedCode(sandboxEnv)
      
      if (typeof ComponentFunction !== 'function') {
        throw new Error('Generated code did not return a valid React component')
      }

      setPreviewComponent(() => ComponentFunction)
    } catch (err) {
      console.error('Error creating preview component:', err)
      setError(err.toString())
    }
  }, [code])

  return (
    <div className="flex-1 p-4 bg-white border-l flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Preview</h2>
      <div className="border p-4 rounded-md flex-grow overflow-auto">
        {error ? (
          <div className="text-red-500" role="alert">Error rendering preview: {error}</div>
        ) : PreviewComponent ? (
          <React.Suspense fallback={<div>Loading...</div>}>
            <PreviewComponent />
          </React.Suspense>
        ) : (
          <div className="text-gray-400">No preview available</div>
        )}
      </div>
      {explanation && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md">
          <h3 className="font-semibold mb-1">Changes:</h3>
          <p className="text-sm text-gray-600">{explanation}</p>
        </div>
      )}
    </div>
  )
}