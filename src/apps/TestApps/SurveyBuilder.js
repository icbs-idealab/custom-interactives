import React, { useState } from "react";
import { Plus, Trash2, MoveUp, MoveDown, Eye, Edit2 } from "lucide-react";

const SurveyBuilder = () => {
  const questionTypes = [
    { id: "likert", label: "Likert Scale" },
    { id: "multiChoice", label: "Multiple Choice" },
    { id: "openEnded", label: "Open Ended" },
  ];

  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "likert",
      text: "How satisfied are you with our service?",
      options: [
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ],
    },
    {
      id: 2,
      type: "multiChoice",
      text: "Which feature do you use most often?",
      options: ["Feature A", "Feature B", "Feature C"],
    },
  ]);

  const [previewMode, setPreviewMode] = useState(false);

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      text: "",
      options:
        type === "likert"
          ? [
              "Strongly Disagree",
              "Disagree",
              "Neutral",
              "Agree",
              "Strongly Agree",
            ]
          : type === "multiChoice"
            ? ["Option 1"]
            : [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id, updates) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    );
  };

  const moveQuestion = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    )
      return;

    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + (direction === "up" ? -1 : 1)];
    newQuestions[index + (direction === "up" ? -1 : 1)] = temp;
    setQuestions(newQuestions);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Market Research Survey Builder</h1>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {previewMode ? <Edit2 size={20} /> : <Eye size={20} />}
          {previewMode ? "Edit Survey" : "Preview"}
        </button>
      </div>

      {!previewMode ? (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold mb-4">Add Question</h2>
            <div className="flex gap-4">
              {questionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => addQuestion(type.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <Plus size={16} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, { text: e.target.value })
                    }
                    placeholder="Enter your question..."
                    className="w-full p-2 mb-4 border rounded-md"
                  />

                  {(question.type === "multiChoice" ||
                    question.type === "likert") && (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(question.id, {
                                options: newOptions,
                              });
                            }}
                            className="flex-1 p-2 border rounded-md"
                          />
                          {question.type === "multiChoice" && (
                            <button
                              onClick={() => {
                                const newOptions = question.options.filter(
                                  (_, i) => i !== optIndex,
                                );
                                updateQuestion(question.id, {
                                  options: newOptions,
                                });
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      {question.type === "multiChoice" && (
                        <button
                          onClick={() => {
                            const newOptions = [
                              ...question.options,
                              `Option ${question.options.length + 1}`,
                            ];
                            updateQuestion(question.id, {
                              options: newOptions,
                            });
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Plus size={16} className="inline mr-2" />
                          Add Option
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => moveQuestion(index, "up")}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoveUp size={16} />
                  </button>
                  <button
                    onClick={() => moveQuestion(index, "down")}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoveDown size={16} />
                  </button>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="p-1 hover:bg-gray-100 rounded text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <h3 className="font-medium mb-4">
                {index + 1}. {question.text || "Untitled Question"}
              </h3>

              {question.type === "likert" && (
                <div className="grid grid-cols-5 gap-2">
                  {question.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center justify-center p-2 border rounded-md hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {question.type === "multiChoice" && (
                <div className="space-y-2">
                  {question.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center p-2 border rounded-md hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}

              {question.type === "openEnded" && (
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Enter your answer here..."
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyBuilder;
