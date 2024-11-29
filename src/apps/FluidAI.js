import { useState, useRef, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

// Basic Card Component
const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Basic Button Component
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Tab Component
const Tab = ({ title, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 ${isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"} rounded-lg`}
  >
    {title}
  </button>
);

const ExerciseBox = ({ title, initialText, initialVersionContent }) => {
  const [versions, setVersions] = useState([
    { text: initialText, feedback: null, feedbackGiven: false },
  ]);
  const [currentVersion, setCurrentVersion] = useState(0);

  const handleTabClick = (index) => {
    setCurrentVersion(index);
  };

  const handleFeedback = (type, versionIndex) => {
    setVersions(
      versions.map((version, index) =>
        index === versionIndex
          ? { ...version, feedback: type, feedbackGiven: true }
          : version
      )
    );
  };

  const addExercise = (text) => {
    const newIndex = versions.length;
    setVersions([...versions, { text, feedback: null, feedbackGiven: false, submittedAnswer: "" }]);
    setCurrentVersion(newIndex); // Switch focus to the newly added version
  };

  const handleSubmit = (index) => {
    const input = document.getElementById(`input-${index}`);
    if (input && input.value.trim() !== "") {
      setVersions(
        versions.map((version, idx) =>
          idx === index
            ? { ...version, submittedAnswer: input.value.trim() }
            : version
        )
      );
    }
  };

  return (
    <Card className="mb-6">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-200">{title}</span>
          <span className="text-sm bg-gray-50 dark:bg-gray-900 px-4 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
            {currentVersion + 1} / {versions.length}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-6">
        <div className="flex space-x-2 mb-4">
          {versions.map((version, index) => (
            <Tab
              key={index}
              title={`Version ${index + 1}`}
              onClick={() => handleTabClick(index)}
              isActive={currentVersion === index}
            />
          ))}
        </div>

        {/* Display Current Version Card */}
        <div className="rounded-2xl p-6 border">
          <div className="mb-8 text-gray-700 dark:text-gray-200 text-lg">
            {versions[currentVersion].text}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                className="bg-yellow-400 text-gray-700 hover:bg-yellow-300"
                onClick={() => addExercise("Generated a new example")}
              >
                Generate text example
              </Button>
              <Button
                className="bg-yellow-400 text-gray-700 hover:bg-yellow-300"
                onClick={() => addExercise("Generated an audio explanation")}
              >
                Generate audio explanation
              </Button>
              <Button
                className="bg-yellow-400 text-gray-700 hover:bg-yellow-300"
                onClick={() => addExercise("Generated a visualization")}
              >
                Generate visualization
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className={`border-green-200 text-green-600 hover:bg-green-50 ${versions[currentVersion].feedback === "understand" && "bg-green-50"}`}
                  onClick={() => handleFeedback("understand", currentVersion)}
                >
                  <ThumbsUp className="w-5 h-5" />
                  I understand
                </Button>
                <Button
                  className={`border-red-200 text-red-600 hover:bg-red-50 ${versions[currentVersion].feedback === "dont-understand" && "bg-red-50"}`}
                  onClick={() => handleFeedback("dont-understand", currentVersion)}
                >
                  <ThumbsDown className="w-5 h-5" />
                  I don't understand
                </Button>
              </div>
              {/* Feedback Message */}
              {versions[currentVersion].feedback === "understand" && (
                <p className="text-green-600 text-sm mt-2 text-center">
                  Great! This exercise will be boosted.
                </p>
              )}
              {versions[currentVersion].feedback === "dont-understand" && (
                <p className="text-blue-600 text-sm mt-2 text-center">
                  Try generating another exercise.
                </p>
              )}
            </div>

            {/* Icon for Cards */}
            {currentVersion === 0 ? (
              <div className="absolute top-3 right-3">
                <CheckCircle size={40} className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md" />
              </div>
            ) : (
              <div className="absolute top-3 right-3">
                <Sparkles size={40} className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md" />
              </div>
            )}

            {/* Free Text Input */}
            <div className="mt-4">
              <textarea
                id={`input-${currentVersion}`}
                className={`w-full p-3 border rounded-lg resize-none ${versions[currentVersion].submittedAnswer ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                placeholder="Enter your answer here..."
                disabled={!!versions[currentVersion].submittedAnswer}
                defaultValue={versions[currentVersion].submittedAnswer}
              />
              {!versions[currentVersion].submittedAnswer && (
                <Button
                  className="mt-2 bg-blue-500 text-white hover:bg-blue-400"
                  onClick={() => handleSubmit(currentVersion)}
                >
                  Submit Answer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const LearningComponent = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <Button className="fixed top-6 right-6 p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:-translate-y-0.5 hover:shadow-md" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
          Private Equity: Waterfall Structures and Incentives
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          In this activity, you will explore key concepts in private equity,
          focusing on waterfall structures, carried interest mechanisms, and
          distribution thresholds. Each exercise is designed to provide an
          interactive and practical understanding of these topics, allowing you
          to analyze scenarios, experiment with calculations, and apply
          theoretical principles to realistic private equity cases.
        </p>

        <ExerciseBox
          title="Waterfall Structures"
          initialText="Understand how waterfall structures dictate the distribution of profits in private equity deals."
          initialVersionContent="Explore scenarios for preferred returns and hurdle rates."
        />

        <p className="text-lg text-gray-700 dark:text-gray-300 mt-8 mb-6">
          Having explored the fundamentals of waterfall structures, the next
          step is to understand how carried interest mechanisms create
          incentives for private equity managers. These mechanisms are essential
          for aligning the interests of fund managers and investors, and in the
          following exercise, you’ll delve into how carried interest is
          calculated and distributed across various scenarios.
        </p>

        <ExerciseBox
          title="Carried Interest Mechanisms"
          initialText="Carried interest is a critical incentive structure in private equity. Let’s explore how it works."
          initialVersionContent="Analyze IRR hurdles and carried interest calculations."
        />

        <p className="text-lg text-gray-700 dark:text-gray-300 mt-8 mb-6">
          Now that you’ve examined the intricacies of carried interest, it’s
          time to consider how distribution thresholds influence private equity
          deals. This final exercise will guide you through the impact of these
          thresholds on profit-sharing arrangements, highlighting the balance
          between investor priorities and managerial rewards.
        </p>

        <ExerciseBox
          title="Distribution Thresholds"
          initialText="Learn how distribution thresholds impact profit-sharing among investors and managers."
          initialVersionContent="Simulate different threshold levels and their effects on equity returns."
        />

        <p className="text-lg text-gray-700 dark:text-gray-300 mt-12">
          By mastering these concepts, you'll gain a strong foundation in
          private equity structures and their implications. In the next
          activity, you will build on these foundations by examining the due
          diligence process and assessing how market conditions and investment
          strategies influence fund performance.
        </p>
      </div>
    </div>
  );
};

export default LearningComponent;