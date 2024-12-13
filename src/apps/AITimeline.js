import React, { useState } from "react";

const TimelineEvent = ({ event, index, isSelected, onClick }) => {
  const isEven = index % 2 === 0;
  return (
    <div className={`md:flex md:items-center ${isEven ? "" : "md:flex-row-reverse"}`}>
      <div className={`w-full md:w-5/12 mb-4 md:mb-0 ${isEven ? "md:text-right md:pr-4" : "md:text-left md:pl-4"}`}>
        <button
          onClick={onClick}
          className={`w-full p-4 rounded-lg transition-all duration-200 text-left ${
            isSelected
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
              : "bg-white hover:bg-indigo-50 shadow"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <div
              className={`text-sm ${isSelected ? "text-gray-100" : "text-gray-600"}`}
            >
              {event.year}
            </div>
          </div>
          {isSelected && (
            <div className="mt-2">
              <p
                className={`text-sm font-medium ${isSelected ? "text-gray-100" : "text-gray-800"}`}
              >
                {event.summary}
              </p>
            </div>
          )}
        </button>
      </div>

      <div className="hidden md:block md:w-2/12 md:flex md:justify-center">
        <div
          className={`w-4 h-4 rounded-full border-4 transition-all duration-200 ${
            isSelected
              ? "border-indigo-500 bg-white scale-125"
              : "border-indigo-300 bg-white hover:border-indigo-400"
          }`}
        />
      </div>

      <div className="hidden md:block md:w-5/12" />
    </div>
  );
};

const Timeline = () => {
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);

  const events = [
    {
      year: 1943,
      title: "Foundations of Neural Networks",
      summary:
        "Warren McCulloch and Walter Pitts published 'A Logical Calculus of Ideas Immanent in Nervous Activity,' laying the theoretical groundwork for neural networks by modelling how the brain processes information.",
    },
    {
      year: 1950,
      title: "Turing's Paper",
      summary:
        "Alan Turing introduced the concept of the Turing Test in his paper 'Computing Machinery and Intelligence,' proposing a practical way to evaluate a machine's ability to exhibit human-like intelligence.",
    },
    {
      year: 1956,
      title: "Dartmouth Conference",
      summary:
        "The Dartmouth Conference brought together leading thinkers such as John McCarthy and Marvin Minsky to formalise artificial intelligence as a field of academic study.",
    },
    {
      year: 1960,
      title: "AI Winter",
      summary:
        "A lack of significant progress and overambitious predictions led to a decline in funding and interest in AI research, marking the first 'AI Winter.'",
    },
    {
      year: 1965,
      title: "ELIZA",
      summary:
        "Joseph Weizenbaum developed ELIZA, a natural language processing program capable of simulating conversation, marking an early step in human-computer interaction.",
    },
    {
      year: 1980,
      title: "Expert Systems",
      summary:
        "Expert systems gained prominence as AI programs designed to simulate the decision-making abilities of human experts, with applications in industries such as finance and medicine.",
    },
    {
      year: 1986,
      title: "Backpropagation in Neural Networks",
      summary:
        "Geoffrey Hinton, David Rumelhart, and Ronald Williams introduced the backpropagation algorithm, allowing for the training of deeper neural networks and advancing machine learning techniques.",
    },
    {
      year: 1997,
      title: "Deep Blue",
      summary:
        "IBM's Deep Blue defeated chess world champion Garry Kasparov, demonstrating AI's ability to excel in strategic and highly complex tasks.",
    },
    {
      year: 2002,
      title: "Roomba",
      summary:
        "The iRobot company launched Roomba, the first mass-produced robotic vacuum cleaner with AI-powered navigation, bringing AI into everyday households.",
    },
    {
      year: 2006,
      title: "Deep Learning",
      summary:
        "Geoffrey Hinton's work popularised deep learning techniques, enabling breakthroughs in image and speech recognition and reinvigorating interest in AI research.",
    },
    {
      year: 2011,
      title: "IBM Watson",
      summary:
        "IBM's Watson competed on the television quiz show 'Jeopardy!' and defeated two former champions, showcasing AI's ability to process and analyse natural language at an advanced level.",
    },
    {
      year: 2012,
      title: "Advances in Neural Networks",
      summary:
        "Deep neural networks achieved significant success in image recognition tasks, setting the stage for modern AI applications in computer vision.",
    },
    {
      year: 2017,
      title: "Transformers",
      summary:
        "The introduction of Transformer models revolutionised natural language processing by enabling more efficient and accurate handling of text data, forming the basis for contemporary language models.",
    },
    {
      year: 2022,
      title: "ChatGPT",
      summary:
        "OpenAI launched ChatGPT, an AI conversational model that brought advanced natural language capabilities to a broad audience, transforming how people interact with AI.",
    },
    {
      year: 2023,
      title: "AI Copyright Lawsuit",
      summary:
        "Artists filed a class-action lawsuit against Stability AI, DeviantArt, and MidJourney, raising legal questions about the use of copyrighted works in training AI models.",
    },
  ];

  const handleEventClick = (index) => {
    setSelectedEventIndex(selectedEventIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-full mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">A Timeline of the History of AI</h1>
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200" />
        <div className="space-y-4 md:space-y-8">
          {events.map((event, index) => (
            <TimelineEvent
              key={event.year}
              event={event}
              index={index}
              isSelected={selectedEventIndex === index}
              onClick={() => handleEventClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
