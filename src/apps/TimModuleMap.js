import React, { useState } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Brain, Glasses, Network, Lightbulb, X } from 'lucide-react';

// Add some basic styles to handle the modal overlay and positioning
const overlayStyles = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 50,
};

const contentStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  borderRadius: '6px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  width: '90%',
  maxWidth: '42rem',
  maxHeight: '85vh',
  overflowY: 'auto',
  zIndex: 51,
};

const ModuleMap = () => {
  const [activeTheme, setActiveTheme] = useState(null);
  
  const themes = {
    landscape: { color: 'bg-blue-500', title: 'The Landscape' },
    immersive: { color: 'bg-emerald-500', title: 'Immersive Technologies' },
    intelligent: { color: 'bg-amber-500', title: 'Intelligent Technologies' },
    decentralised: { color: 'bg-purple-500', title: 'Decentralised Technologies' },
    implementation: { color: 'bg-rose-500', title: 'Future' }
  };

  const crossCuttingThemes = [
    { name: 'Privacy & Security', icon: <Network className="w-5 h-5" /> },
    { name: 'Innovation', icon: <Lightbulb className="w-5 h-5" /> },
    { name: 'Customer Experience', icon: <Brain className="w-5 h-5" /> },
    { name: 'Digital Transformation', icon: <Glasses className="w-5 h-5" /> }
  ];


  const sessions = {
    1: {
      title: 'Introduction: The Current Technology Landscape',
      theme: 'landscape',
      topics: ['Fourth Industrial Revolution', 'MarTech Landscape', 'Gartner Hype Cycle'],
      connections: [2, 5, 8],
      crossCutting: [0, 2]
    },
    2: {
      title: 'What are Immersive Technologies?',
      theme: 'immersive',
      topics: ['Metaverse Concepts', 'VR/AR/MR/XR Definitions', 'Virtual Spaces'],
      connections: [3, 4],
      crossCutting: [2, 3]
    },
    3: {
      title: 'VR and AR in Practice',
      theme: 'immersive',
      topics: ['Marketing Applications', 'Case Studies', 'Virtual Humans'],
      connections: [2, 4, 7],
      crossCutting: [1, 2]
    },
    4: {
      title: 'Developing Virtual Worlds',
      theme: 'immersive',
      topics: ['Building Blocks', 'Storytelling', 'Interactive Elements'],
      connections: [2, 3, 9],
      crossCutting: [1, 2]
    },
    5: {
      title: 'What are Intelligent Technologies?',
      theme: 'intelligent',
      topics: ['AI Origins', 'Machine Learning', 'Deep Learning'],
      connections: [6, 7],
      crossCutting: [0, 1]
    },
    6: {
      title: 'AI in Practice',
      theme: 'intelligent',
      topics: ['Chatbots', 'Generative AI', 'Ethical Considerations'],
      connections: [5, 7],
      crossCutting: [0, 2]
    },
    7: {
      title: 'Uses of AI in Business and Marketing',
      theme: 'intelligent',
      topics: ['Predictive Analytics', 'Personalization', 'Sentiment Analysis'],
      connections: [6, 9],
      crossCutting: [1, 2]
    },
    8: {
      title: 'What are Decentralised Technologies?',
      theme: 'decentralised',
      topics: ['Blockchain', 'Smart Contracts', 'NFTs'],
      connections: [9],
      crossCutting: [0, 3]
    },
    9: {
      title: 'IoT, Web 3.0 and the Metaverse',
      theme: 'decentralised',
      topics: ['Internet of Things', 'Web Evolution', 'Future of Web'],
      connections: [8, 10],
      crossCutting: [1, 3]
    },
    10: {
      title: 'The Future of Technologies in Marketing',
      theme: 'implementation',
      topics: ['Liquid Societies', 'Technology 5.0', 'Marketing Evolution'],
      connections: [7, 9],
      crossCutting: [1, 2, 3]
    }
  };

  const SessionModal = ({ session, sessionNum }) => (
    <div className="p-6">
      <h3 className="text-lg font-bold mb-4">{`Session ${sessionNum}: ${session.title}`}</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Key Topics</h4>
          <ul className="list-disc pl-5 space-y-1">
            {session.topics.map((topic, i) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Cross-cutting Themes</h4>
          <div className="flex flex-wrap gap-2">
            {session.crossCutting.map((themeIndex) => (
              <span 
                key={themeIndex}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                {crossCuttingThemes[themeIndex].icon}
                {crossCuttingThemes[themeIndex].name}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Connected Sessions</h4>
          <div className="flex flex-wrap gap-2">
            {session.connections.map((connectedSession) => (
              <span 
                key={connectedSession}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                Session {connectedSession}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const SessionTile = ({ sessionNum }) => {
    const session = sessions[sessionNum];
    const isHighlighted = activeTheme !== null && session.crossCutting.includes(activeTheme);
    
    return (
      <AlertDialogPrimitive.Root>
        <AlertDialogPrimitive.Trigger asChild>
          <div 
            className={`
              relative p-4 rounded-lg shadow-lg cursor-pointer
              transition-all duration-300
              ${themes[session.theme].color} text-white
              min-h-[120px] flex flex-col justify-between
              ${isHighlighted ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'}
              ${!isHighlighted && activeTheme !== null ? 'opacity-50' : 'opacity-100'}
            `}
          >
            <div className="text-sm font-bold">Session {sessionNum}</div>
            <div className="text-sm mt-2">{session.title}</div>
          </div>
        </AlertDialogPrimitive.Trigger>

        <AlertDialogPrimitive.Portal>
          <AlertDialogPrimitive.Overlay style={overlayStyles}>
            <AlertDialogPrimitive.Content style={contentStyles}>
              <div className="relative">
                <AlertDialogPrimitive.Cancel className="absolute right-2 top-2 p-2 hover:bg-gray-100 rounded-full">
                  <X className="h-4 w-4" />
                </AlertDialogPrimitive.Cancel>
                <SessionModal session={session} sessionNum={sessionNum} />
              </div>
            </AlertDialogPrimitive.Content>
          </AlertDialogPrimitive.Overlay>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-center mb-12">Technologies in Marketing</h2>
      
      {/* Cross-cutting themes banner */}
      <div className="mb-12">
        <h3 className="text-lg font-medium mb-4 text-center">Cross-cutting Themes</h3>
        <div className="flex justify-center gap-6">
          {crossCuttingThemes.map((theme, i) => (
            <button
              key={i}
              onClick={() => setActiveTheme(activeTheme === i ? null : i)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full
                transition-all duration-300
                ${activeTheme === i 
                  ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105' 
                  : 'bg-gray-100 hover:bg-gray-200'}
              `}
            >
              {theme.icon}
              <span className="text-sm">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
        {Object.keys(sessions).map((sessionNum) => (
          <SessionTile key={sessionNum} sessionNum={parseInt(sessionNum)} />
        ))}
        
        {/* Theme labels */}
        <div className="absolute -top-8 left-0 right-0 flex justify-between text-sm text-gray-600">
          {Object.values(themes).map((theme, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${theme.color}`}></div>
              {theme.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleMap;
