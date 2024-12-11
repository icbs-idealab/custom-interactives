import React, { useState } from "react";

const TimelineEvent = ({ event, index, isSelected, onClick }) => {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`flex items-center ${isEven ? "flex-row" : "flex-row-reverse"}`}
    >
      <div
        className={`w-5/12 ${isEven ? "text-right pr-4" : "text-left pl-4"}`}
      >
        <button
          onClick={onClick}
          className={`w-full p-4 rounded-lg transition-all duration-200 text-left ${
            isSelected
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
              : "bg-white hover:bg-indigo-50 shadow"
          }`}
        >
          <h3 className="font-bold text-lg">{event.title}</h3>
          <div
            className={`text-sm ${isSelected ? "text-gray-100" : "text-gray-600"}`}
          >
            {event.year}
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

      <div className="w-2/12 flex justify-center">
        <div
          className={`w-4 h-4 rounded-full border-4 transition-all duration-200 ${
            isSelected
              ? "border-indigo-500 bg-white scale-125"
              : "border-indigo-300 bg-white hover:border-indigo-400"
          }`}
        />
      </div>

      <div className="w-5/12" />
    </div>
  );
};

const Timeline = () => {
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);

  const events = [
    {
      year: 1950,
      title: "Turing's Paper",
      summary:
        "Turing proposed a practical test for machine intelligence: if a human interrogator can't distinguish between responses from a machine and a human, the machine demonstrates human-like intelligence.",
    },
    {
      year: 1956,
      title: "Dartmouth Conference",
      summary:
        "The historic conference brought together experts in neural networks, computation and automata theory, officially establishing AI as a field of study.",
    },
    {
      year: 1960,
      title: "AI Winter",
      summary:
        "Limited technology and data availability led to decreased funding and interest in AI research, slowing progress for nearly two decades.",
    },
    {
      year: 1997,
      title: "Deep Blue",
      summary:
        "This historic victory marked the first time a computer beat a world champion chess player, demonstrating AI's potential in complex strategic thinking.",
    },
    {
      year: 2006,
      title: "Deep Learning",
      summary:
        "Hinton's work reignited interest in neural networks by introducing deep learning techniques that would revolutionise AI capabilities.",
    },
    {
      year: 2011,
      title: "IBM Watson",
      summary:
        "Watson's victory showed AI's ability to understand and respond to natural language questions, process complex information and compete with human champions.",
    },
    {
      year: 2012,
      title: "Neural Networks",
      summary:
        "This breakthrough demonstrated the power of deep neural networks in image recognition, laying groundwork for modern computer vision systems.",
    },
    {
      year: 2017,
      title: "Transformers",
      summary:
        "Transformers revolutionised NLP by enabling more efficient processing of text sequences, becoming the foundation for modern language models.",
    },
    {
      year: 2018,
      title: "GPT",
      summary:
        "The first GPT model marked the beginning of a new era in large language models, setting the stage for more advanced versions.",
    },
    {
      year: 2022,
      title: "ChatGPT",
      summary:
        "ChatGPT's launch marked a turning point in AI accessibility, bringing powerful language models to everyday users through a conversational interface.",
    },
  ];

  const handleEventClick = (index) => {
    setSelectedEventIndex(selectedEventIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-full mx-auto">
      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200" />
        <div className="space-y-8">
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
