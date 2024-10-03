import React, { useState } from 'react';
import Split from 'react-split';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import CodePreviewToggle from './components/CodePreviewToggle';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AppProvider>
      <div className="flex flex-col h-screen bg-gray-100">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 flex overflow-hidden">
          {isSidebarOpen && <Sidebar />}
          <Split
            sizes={[70, 30]}
            minSize={100}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="vertical"
            cursor="row-resize"
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 overflow-auto">
              <CodePreviewToggle />
            </div>
            <ChatBox />
          </Split>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;