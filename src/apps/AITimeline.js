
import React, { useState } from "react";

const TimelineEvent = ({ event, index, isSelected, onClick }) => {
  return (
    <div className="md:flex md:items-center">
      <div className="w-full md:w-5/12 mb-4 md:mb-0">
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
            <div className={`text-sm ${isSelected ? "text-gray-100" : "text-gray-600"}`}>
              {event.year}
            </div>
          </div>
          {isSelected && (
            <div className="mt-2">
              <p className={`text-sm font-medium ${isSelected ? "text-gray-100" : "text-gray-800"}`}>
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
    { year: 1950, title: "Turing's Paper", summary: "Turing proposed a practical test for machine intelligence." },
    { year: 1956, title: "Dartmouth Conference", summary: "The historic conference established AI as a field." },
    // Add other events as necessary...
  ];

  const handleEventClick = (index) => {
    setSelectedEventIndex(selectedEventIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-full mx-auto">
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
