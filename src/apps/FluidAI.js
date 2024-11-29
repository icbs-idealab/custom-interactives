import { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Headphones, Type, BarChart, Moon, Sun, CheckCircle, Sparkles } from 'lucide-react';

// Basic Card Component
const Card = ({ children, className = '', ...props }) => (
  <div 
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Basic Button Component
const Button = ({ children, className = '', ...props }) => (
  <button 
    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 ${className}`} 
    {...props}
  >
    {children}
  </button>
);

// Theme Toggle Component
const ThemeToggle = ({ isDark, onToggle }) => (
  <Button
    onClick={onToggle}
    className="fixed top-6 right-6 p-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700
    text-gray-700 dark:text-gray-200 hover:-translate-y-0.5 hover:shadow-md"
    aria-label="Toggle theme"
  >
    {isDark ? (
      <Sun className="w-5 h-5" />
    ) : (
      <Moon className="w-5 h-5" />
    )}
  </Button>
);

const NavButton = ({ direction, onClick, disabled }) => (
  <Button
    onClick={onClick}
    className={`absolute ${direction === 'left' ? '-left-4' : '-right-4'} top-1/2 -translate-y-1/2 z-10
    h-12 w-12 flex items-center justify-center rounded-full 
    bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600
    text-gray-700 dark:text-gray-300 font-bold text-lg
    hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 transition-transform
    ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
    disabled={disabled}
    aria-label={direction === 'left' ? 'Previous' : 'Next'}
  >
    {direction === 'left' ? '←' : '→'}
  </Button>
);

// Tooltip Component
const Tooltip = ({ children, text }) => (
    <div className="relative group">
      {children}
      <div className="absolute top-full mt-1 right-0 bg-gray-800 text-white text-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {text}
      </div>
    </div>
  );
  
  
  const ExerciseBox = ({ title, initialText, initialVersionContent }) => {
    const [versions, setVersions] = useState([{ text: initialText, feedback: null, feedbackGiven: false }]);
    const [currentVersion, setCurrentVersion] = useState(0);
    const scrollContainerRef = useRef(null);
  
    useEffect(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = container.offsetWidth;
        container.scrollTo({
          left: cardWidth * currentVersion,
          behavior: 'smooth',
        });
      }
    }, [currentVersion]);
  
    const handleScroll = (direction) => {
      const newVersion = direction === 'left'
        ? Math.max(0, currentVersion - 1)
        : Math.min(versions.length - 1, currentVersion + 1);
      setCurrentVersion(newVersion);
    };
  
    const handleFeedback = (type, versionIndex) => {
      setVersions(versions.map((version, index) => 
        index === versionIndex
          ? { ...version, feedback: type, feedbackGiven: true }
          : version
      ));
    };
  
    const addExercise = (text) => {
      const newIndex = versions.length;
      setVersions([...versions, { text, feedback: null, feedbackGiven: false }]);
      setCurrentVersion(newIndex); // Switch focus to the newly added version
    };
  
    return (
        <Card className="mb-6">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {title}
              </span>
              <span className="text-sm bg-gray-50 dark:bg-gray-900 px-4 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                {currentVersion + 1} / {versions.length}
              </span>
            </div>
          </div>
    
          <div className="p-6">
            <div className="relative">
              <NavButton 
                direction="left"
                onClick={() => handleScroll('left')}
                disabled={currentVersion === 0}
              />
              
              <NavButton 
                direction="right"
                onClick={() => handleScroll('right')}
                disabled={currentVersion === versions.length - 1}
              />
    
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-hidden gap-6 snap-x snap-mandatory touch-pan-x px-2"
              >
                {versions.map((version, index) => (
                  <div 
                    key={index}
                    className="flex-none w-full snap-center relative"
                  >
                    {/* Icon for Cards */}
                    {index === 0 ? (
                      <Tooltip text="Lecturer approved exercise">
                        <div className="absolute top-3 right-3 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                          <CheckCircle size={16} />
                        </div>
                      </Tooltip>
                    ) : (
                      <Tooltip text="AI-generated exercise">
                        <div className="absolute top-3 right-3 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                          <Sparkles size={16} />
                        </div>
                      </Tooltip>
                    )}
    
                    <div className="rounded-2xl p-6">
                      <div className="mb-8 text-gray-700 dark:text-gray-200 text-lg">
                        {version.text}
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
                              className={`border-green-200 text-green-600 hover:bg-green-50 ${version.feedback === 'understand' && 'bg-green-50'}`}
                              onClick={() => handleFeedback('understand', index)}
                            >
                              <ThumbsUp className="w-5 h-5" />
                              I understand
                            </Button>
                            <Button
                              className={`border-red-200 text-red-600 hover:bg-red-50 ${version.feedback === 'dont-understand' && 'bg-red-50'}`}
                              onClick={() => handleFeedback('dont-understand', index)}
                            >
                              <ThumbsDown className="w-5 h-5" />
                              I don't understand
                            </Button>
                          </div>
                          {/* Feedback Message */}
                          {version.feedback === 'understand' && (
                            <p className="text-green-600 text-sm mt-2 text-center">
                              Great! This exercise will be boosted.
                            </p>
                          )}
                          {version.feedback === 'dont-understand' && (
                            <p className="text-blue-600 text-sm mt-2 text-center">
                              Try generating another exercise.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      );
    };
        
const LearningComponent = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <ThemeToggle isDark={theme === 'dark'} onToggle={toggleTheme} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
          Private Equity: Waterfall Structures and Incentives
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        In this activity, you will explore key concepts in private equity, focusing on waterfall structures, carried interest mechanisms, and distribution thresholds. Each exercise is designed to provide an interactive and practical understanding of these topics, allowing you to analyze scenarios, experiment with calculations, and apply theoretical principles to realistic private equity cases. 
        </p>

        <ExerciseBox
          title="Waterfall Structures"
          initialText="Understand how waterfall structures dictate the distribution of profits in private equity deals."
          initialVersionContent="Explore scenarios for preferred returns and hurdle rates."
        />

        <p className="text-lg text-gray-700 dark:text-gray-300 mt-8 mb-6">
        Having explored the fundamentals of waterfall structures, the next step is to understand how carried interest mechanisms create incentives for private equity managers. These mechanisms are essential for aligning the interests of fund managers and investors, and in the following exercise, you’ll delve into how carried interest is calculated and distributed across various scenarios.
        </p>

        <ExerciseBox
          title="Carried Interest Mechanisms"
          initialText="Carried interest is a critical incentive structure in private equity. Let’s explore how it works."
          initialVersionContent="Analyze IRR hurdles and carried interest calculations."
        />

        <p className="text-lg text-gray-700 dark:text-gray-300 mt-8 mb-6">
        Now that you’ve examined the intricacies of carried interest, it’s time to consider how distribution thresholds influence private equity deals. This final exercise will guide you through the impact of these thresholds on profit-sharing arrangements, highlighting the balance between investor priorities and managerial rewards.        </p>

        <ExerciseBox
          title="Distribution Thresholds"
          initialText="Learn how distribution thresholds impact profit-sharing among investors and managers."
          initialVersionContent="Simulate different threshold levels and their effects on equity returns."
        />

        <p className="text-lg text-gray-700 dark:text-gray-300 mt-12">
          By mastering these concepts, you'll gain a strong foundation in private equity structures and their implications. In the next activity, you will build on these foundations by examining the due diligence process and assessing how market conditions and investment strategies influence fund performance.
        </p>
      </div>
    </div>
  );
};

export default LearningComponent;
