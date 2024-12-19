import React, { useState, useEffect } from 'react';

const TimelineGame = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      year: 1943,
      title: "Foundations of neural networks",
      description: "Warren McCulloch and Walter Pitts published a paper titled 'A Logical Calculus of Ideas Immanent in Nervous Activity', which laid the theoretical groundwork for neural networks by modeling how the brain processes information.",
      revealed: false,
      isCorrect: null
    },
    {
      id: 2,
      year: 1950,
      title: "Turing's paper",
      description: "Alan Turing introduced the concept of the Turing Test in his paper 'Computing Machinery and Intelligence', proposing a practical way to evaluate a machine's ability to exhibit human-like intelligence.",
      revealed: false,
      isCorrect: null
    },
    {
      id: 3,
      year: 1956,
      title: "Dartmouth Conference",
      description: "The Dartmouth Conference brought together leading thinkers such as John McCarthy and Marvin Minsky to formalize artificial intelligence as a field of academic study.",
      revealed: false,
      isCorrect: null
    },
    {
      id: 4,
      year: 1965,
      title: "ELIZA",
      description: "Joseph Weizenbaum developed ELIZA, a natural language processing program capable of simulating conversation, marking an early step in human-computer interaction.",
      revealed: false,
      isCorrect: null
    },
    {
      id: 5,
      year: 1980,
      title: "Expert systems",
      description: "Expert systems gained prominence as AI programs designed to simulate the decision-making abilities of human experts, with applications in industries such as finance and medicine.",
      revealed: false,
      isCorrect: null
    },
    {
      id: 6,
      year: 1986,
      title: "Backpropagation in neural networks",
      description: "Geoffrey Hinton, David Rumelhart, and Ronald Williams introduced the backpropagation algorithm, allowing for the training of deeper neural networks and advancing machine learning techniques.",
      revealed: false,
      isCorrect: null
    }
  ]);

  const [isAccessibleMode, setIsAccessibleMode] = useState(false);
  const [placedEvents, setPlacedEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [draggedOverIndex, setDraggedOverIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    // Start with first event
    setPlacedEvents([{ ...events[0], revealed: true }]);
    setCurrentEvent(events[1]);
  }, []);

  const handleDragStart = (e, event) => {
    e.dataTransfer.setData('text/plain', '');
    setDraggedOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDraggedOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (!currentEvent) return;
    placeEvent(dropIndex);
  };

  const handlePositionChange = (direction) => {
    if (direction === 'up') {
      setSelectedPosition(prev => Math.max(0, prev - 1));
    } else {
      setSelectedPosition(prev => Math.min(placedEvents.length, prev + 1));
    }
  };

  const placeEvent = (position) => {
    const newPlacedEvents = [...placedEvents];
    
    // Check if placement is correct
    const prevEvent = position > 0 ? newPlacedEvents[position - 1] : null;
    const nextEvent = newPlacedEvents[position];
    
    const isCorrect = (
      (!prevEvent || prevEvent.year <= currentEvent.year) &&
      (!nextEvent || currentEvent.year <= nextEvent.year)
    );

    const eventToPlace = {
      ...currentEvent,
      revealed: true,
      isCorrect
    };

    newPlacedEvents.splice(position, 0, eventToPlace);
    setPlacedEvents(newPlacedEvents);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const nextEventIndex = events.findIndex(e => e.id === currentEvent.id) + 1;
    if (nextEventIndex < events.length) {
      setCurrentEvent(events[nextEventIndex]);
      setSelectedPosition(0);
    } else {
      setGameComplete(true);
    }

    setDraggedOverIndex(null);
  };

  const revealCorrectOrder = () => {
    setIsRevealing(true);
    setHasRevealed(true);
    
    // First, add transition classes to all events
    const eventsWithTransition = placedEvents.map(event => ({
      ...event,
      transitioning: true
    }));
    setPlacedEvents(eventsWithTransition);

    // After a brief delay, apply the correct order
    setTimeout(() => {
      const sortedEvents = [...placedEvents]
        .sort((a, b) => a.year - b.year)
        .map(event => ({
          ...event,
          isCorrect: true,
          transitioning: true
        }));
      setPlacedEvents(sortedEvents);

      // After animation completes, just remove transition class but keep sorted order
      setTimeout(() => {
        const finalEvents = sortedEvents.map(event => ({
          ...event,
          transitioning: false
        }));
        setPlacedEvents(finalEvents);
        setIsRevealing(false);
      }, 1000);
    }, 100);
  };

  const resetGame = () => {
    setHasRevealed(false);
    setGameComplete(false);
    setScore(0);
    setDraggedOverIndex(null);
    setSelectedPosition(0);
    setPlacedEvents([{ ...events[0], revealed: true }]);
    setCurrentEvent(events[1]);
  };

  const renderDragDropVersion = () => (
    <div className="space-y-2">
      {currentEvent && !gameComplete && (
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, currentEvent)}
          className="p-4 bg-white border-2 border-blue-500 rounded-lg mb-4 cursor-move hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold">{currentEvent.title}</h3>
          <p className="text-sm text-gray-600">{currentEvent.description}</p>
        </div>
      )}

      <div className="space-y-2">
        {placedEvents.map((event, index) => (
          <React.Fragment key={event.id}>
            <div
              className={`h-2 transition-all ${
                draggedOverIndex === index ? 'bg-blue-200 h-8' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            />
            
            <div
              className={`p-4 rounded-lg ${
                event.transitioning ? 'transition-all duration-1000' : ''
              } ${
                event.isCorrect === null
                  ? 'bg-white'
                  : event.isCorrect
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
                {event.revealed && (
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {event.year}
                  </span>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
        
        <div
          className={`h-2 transition-all ${
            draggedOverIndex === placedEvents.length ? 'bg-blue-200 h-8' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, placedEvents.length)}
          onDrop={(e) => handleDrop(e, placedEvents.length)}
        />
      </div>
    </div>
  );

  const renderAccessibleVersion = () => {
    const previewTimeline = [...placedEvents];
    if (currentEvent && !gameComplete) {
      const previewEvent = {
        ...currentEvent,
        isPreview: true,
      };
      previewTimeline.splice(selectedPosition, 0, previewEvent);
    }

    return (
      <div className="space-y-2">
        {previewTimeline.map((event, index) => (
          <div
            key={event.id + (event.isPreview ? '-preview' : '')}
            className={`p-4 rounded-lg ${
              event.transitioning ? 'transition-all duration-1000' : ''
            } ${
              event.isPreview
                ? 'bg-white border-2 border-blue-500 shadow-lg'
                : event.isCorrect === null
                ? 'bg-white'
                : event.isCorrect
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {event.revealed && (
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {event.year}
                  </span>
                )}
                {event.isPreview && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePositionChange('up')}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      aria-label="Move position up"
                      disabled={selectedPosition === 0}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handlePositionChange('down')}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      aria-label="Move position down"
                      disabled={selectedPosition === placedEvents.length}
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => placeEvent(selectedPosition)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      aria-label="Submit position"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">AI History Timeline</h1>
        <p className="text-gray-600 mb-4">
          {isAccessibleMode 
            ? 'Use the up/down arrows to choose a position, then click Submit to place each event.'
            : 'Drag and drop events to place them in chronological order.'}
        </p>
        
        <div className="space-y-2">
          <button
            onClick={() => setIsAccessibleMode(!isAccessibleMode)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            aria-label={`Switch to ${isAccessibleMode ? 'drag and drop' : 'accessible'} version`}
          >
            Switch to {isAccessibleMode ? 'Drag and Drop' : 'Accessible'} Version
          </button>

          {gameComplete && !isRevealing && (
            <div>
              {hasRevealed ? (
                <button
                  onClick={resetGame}
                  className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Play Again
                </button>
              ) : (
                <button
                  onClick={revealCorrectOrder}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Reveal Correct Order
                </button>
              )}
            </div>
          )}
          
          <p className="text-gray-600 pt-2">
            Score: {score}/{events.length - 1}
          </p>
        </div>
      </div>

      {isAccessibleMode ? renderAccessibleVersion() : renderDragDropVersion()}
    </div>
  );
};

export default TimelineGame;