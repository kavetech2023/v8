import React, { createContext, useState, useContext } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [codeHistory, setCodeHistory] = useState([]);
  const [currentCode, setCurrentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previousQueries, setPreviousQueries] = useState([]);

  const addChatMessage = (message, isUser = true) => {
    setChatHistory(prev => [...prev, { id: Date.now(), message, isUser }]);
  };

  const generateCode = async (prompt) => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const context = previousQueries.length > 0 ? `Previous query: ${previousQueries[previousQueries.length - 1]}. ` : '';

      const result = await model.generateContent(`
        ${context}Generate a high-quality React component based on the following description:
        ${prompt}
        
        Please provide only the component code without any explanations.
        The component should be a function named 'Component' that returns JSX.
        Use Tailwind CSS for styling and follow best practices similar to Material UI or shadcn/ui components.
        Ensure the component is accessible, responsive, and follows modern React patterns.
        Here's an example of the expected format:

        import React from 'react';
        import { motion } from 'framer-motion';

        function Component() {
          return (
            <motion.div
              className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* High-quality component content */}
            </motion.div>
          );
        }

        export default Component;

        Make the code as elegant and reusable as possible. Follow best practices and design patterns used in top-tier UI libraries.
        Include proper prop types, default props, and consider adding basic interactivity where appropriate.
        Do not include any comments. Ensure the component is fully responsive and accessible.
        Do not include backticks (\`\`\`) at the beginning or end of the code.
      `);

      let generatedCode = result.response.text();
      
      // Remove backticks if they're present at the beginning and end of the code
      generatedCode = generatedCode.replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '');

      setCurrentCode(generatedCode);
      setCodeHistory(prev => [{ id: Date.now(), code: generatedCode, prompt }, ...prev]);
      addChatMessage(`Generated code for: ${prompt}`, false);
      setPreviousQueries(prevQueries => [...prevQueries, prompt]);
    } catch (error) {
      console.error('Error generating code:', error);
      setCurrentCode('Error generating code. Please try again.');
      addChatMessage('Error generating code. Please try again.', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      chatHistory,
      codeHistory,
      currentCode,
      isLoading,
      addChatMessage,
      generateCode,
    }}>
      {children}
    </AppContext.Provider>
  );
};