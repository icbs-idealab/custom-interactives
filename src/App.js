
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResizeWrapper from './ResizeWrapper';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BreakEven from './apps/BreakEven.js';
import MarketingFundamentals_AdvertisingTimeline from './apps/MarketingFundamentals/AdvertisingTimeline.js';
import MarketingFundamentals_PositioningStatementCreator from './apps/MarketingFundamentals/PositioningStatementCreator.js';
import MarketingFundamentals_PositioningStatementGlobal from './apps/MarketingFundamentals/PositioningStatementGlobal.js';
import SmoTim_AITimeline from './apps/SmoTim/AITimeline.js';
import SmoTim_BlockchainDemo from './apps/SmoTim/BlockchainDemo.js';
import SmoTim_CampaignIdeas from './apps/SmoTim/CampaignIdeas.js';
import SmoTim_ConsumerPersona from './apps/SmoTim/ConsumerPersona.js';
import SmoTim_DragDropTimeline from './apps/SmoTim/DragDropTimeline.js';
import SmoTim_TimModuleMap from './apps/SmoTim/TimModuleMap.js';
import TestApps_AverageCalculator from './apps/TestApps/AverageCalculator.js';
import TestApps_CounterApp from './apps/TestApps/CounterApp.js';
import TestApps_DoubleNumber from './apps/TestApps/DoubleNumber.js';
import TestApps_FluidAI from './apps/TestApps/FluidAI.js';
import TestApps_MarketingDashboard from './apps/TestApps/MarketingDashboard.js';
import TestApps_SurveyBuilder from './apps/TestApps/SurveyBuilder.js';
import TestApps_TestApp__copy_ from './apps/TestApps/TestApp (copy).js';
import TestApps_TestApp from './apps/TestApps/TestApp.js';
import TestApps_ToggleSwitchApp from './apps/TestApps/ToggleSwitchApp.js';

/**
 * We define these constants so the JSX can reference them
 * (and won't throw "no-undef" errors).
 */
const modules = {
  "MarketingFundamentals": [
    "AdvertisingTimeline.js",
    "PositioningStatementCreator.js",
    "PositioningStatementGlobal.js"
  ],
  "SmoTim": [
    "AITimeline.js",
    "BlockchainDemo.js",
    "CampaignIdeas.js",
    "ConsumerPersona.js",
    "DragDropTimeline.js",
    "TimModuleMap.js"
  ],
  "TestApps": [
    "AverageCalculator.js",
    "CounterApp.js",
    "DoubleNumber.js",
    "FluidAI.js",
    "MarketingDashboard.js",
    "SurveyBuilder.js",
    "TestApp (copy).js",
    "TestApp.js",
    "ToggleSwitchApp.js"
  ]
};
const topLevelApps = [
  "BreakEven.js"
];


function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/breakeven': 'Break Even',
      '/marketingfundamentals': 'MarketingFundamentals',
      '/marketingfundamentals/advertisingtimeline': 'Advertising Timeline',
      '/marketingfundamentals/positioningstatementcreator': 'Positioning Statement Creator',
      '/marketingfundamentals/positioningstatementglobal': 'Positioning Statement Global',
      '/smotim': 'SmoTim',
      '/smotim/aitimeline': 'A I Timeline',
      '/smotim/blockchaindemo': 'Blockchain Demo',
      '/smotim/campaignideas': 'Campaign Ideas',
      '/smotim/consumerpersona': 'Consumer Persona',
      '/smotim/dragdroptimeline': 'Drag Drop Timeline',
      '/smotim/timmodulemap': 'Tim Module Map',
      '/testapps': 'TestApps',
      '/testapps/averagecalculator': 'Average Calculator',
      '/testapps/counterapp': 'Counter App',
      '/testapps/doublenumber': 'Double Number',
      '/testapps/fluidai': 'Fluid A I',
      '/testapps/marketingdashboard': 'Marketing Dashboard',
      '/testapps/surveybuilder': 'Survey Builder',
      '/testapps/testapp (copy)': 'Test App (copy)',
      '/testapps/testapp': 'Test App',
      '/testapps/toggleswitchapp': 'Toggle Switch App'
    };
    document.title = titles[location.pathname] || 'Interactive Learning Apps';
  }, [location]);

  return null;
}


function App() {
  return (
    <Router>
      <DynamicTitle />
      <Routes>
        {/* The homepage */}
        <Route
          path="/"
          element={
            
<div className="min-h-screen bg-sky-50 relative flex flex-col">

  {/* Faint repeating grid background (like AI timeline) */}
  <div
    className="absolute inset-0 opacity-5 pointer-events-none"
    style={{
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 40px,
        #000 40px,
        #000 41px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 40px,
        #000 40px,
        #000 41px
      )`
    }}
    aria-hidden="true"
  ></div>

  {/* Red gradient header */}
  <header className="bg-gradient-to-b from-red-600 to-red-700 p-8 shadow-xl z-10">
    <h1 className="text-5xl font-extrabold text-white mb-2 text-center tracking-widest">
      Interactive Learning Apps
    </h1>
    <div className="max-w-xl mx-auto">
      <div className="h-px bg-sky-200 opacity-50"></div>
    </div>
  </header>

  {/* Main container for the modules/apps list */}
  <div className="flex-grow p-8 z-10 flex justify-center items-start">
    {/* White 'card' mimicking timeline style */}
    <div className="relative bg-white shadow-2xl px-8 py-10 max-w-3xl w-full">
      {/* Red corner brackets: top-left */}
      <div
        className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-600"
        aria-hidden="true"
      ></div>
      {/* top-right */}
      <div
        className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-600"
        aria-hidden="true"
      ></div>
      {/* bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-600"
        aria-hidden="true"
      ></div>
      {/* bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-600"
        aria-hidden="true"
      ></div>

      {/* Actual links */}
      <nav className="text-center space-y-12">
        {/* Modules Section */}
        {Object.keys(modules).length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-red-600 mb-4 uppercase tracking-wide">
              Modules
            </h2>
            <ul className="list-none flex flex-col items-center space-y-3">
              
    <li >
      <Link to="/marketingfundamentals" className="text-lg font-semibold underline text-red-600 hover:text-red-800 transition-colors">
        Marketing Fundamentals
      </Link>
    </li>
  
    <li >
      <Link to="/smotim" className="text-lg font-semibold underline text-red-600 hover:text-red-800 transition-colors">
        Smo Tim
      </Link>
    </li>
  
    <li >
      <Link to="/testapps" className="text-lg font-semibold underline text-red-600 hover:text-red-800 transition-colors">
        Test Apps
      </Link>
    </li>
  
            </ul>
          </section>
        )}

        {/* Other Apps Section */}
        {topLevelApps.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-blue-700 mb-4 uppercase tracking-wide">
              Other Apps
            </h2>
            <ul className="list-none flex flex-col items-center space-y-3">
              
    <li >
      <Link to="/breakeven" className="text-lg font-semibold underline text-blue-700 hover:text-blue-900 transition-colors">
        Break Even
      </Link>
    </li>
  
            </ul>
          </section>
        )}
      </nav>
    </div>
  </div>
</div>

          }
        />

        {/* Top-level app routes */}
        
  <Route
    path="/breakeven"
    element={
      <ResizeWrapper>
        <BreakEven />
      </ResizeWrapper>
    }
  />

        {/* Module routes */}
        
    <Route
      path="/marketingfundamentals"
      element={
        
<div className="min-h-screen bg-sky-50 relative flex flex-col justify-start items-center p-8">

  {/* Faint grid background */}
  <div
    className="absolute inset-0 opacity-5 pointer-events-none"
    style={{
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 40px,
        #000 40px,
        #000 41px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 40px,
        #000 40px,
        #000 41px
      )`
    }}
    aria-hidden="true"
  />

  {/* White card */}
  <div className="relative bg-white shadow-2xl px-8 py-10 max-w-3xl w-full">

    {/* Corner brackets */}
    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-600"></div>
    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-600"></div>
    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-600"></div>
    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-600"></div>

    <h2 className="text-3xl font-bold text-red-600 mb-6 uppercase text-center">
      MarketingFundamentals module
    </h2>

    <ul className="list-none p-0 text-center space-y-4">
      
      <li>
        <Link
          to="/marketingfundamentals/advertisingtimeline"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Advertising Timeline
        </Link>
      </li>
    
      <li>
        <Link
          to="/marketingfundamentals/positioningstatementcreator"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Positioning Statement Creator
        </Link>
      </li>
    
      <li>
        <Link
          to="/marketingfundamentals/positioningstatementglobal"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Positioning Statement Global
        </Link>
      </li>
    
    </ul>
  </div>
</div>
  
      }
    />
  

      <Route
        path="/marketingfundamentals/advertisingtimeline"
        element={
          <ResizeWrapper>
            <MarketingFundamentals_AdvertisingTimeline />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/marketingfundamentals/positioningstatementcreator"
        element={
          <ResizeWrapper>
            <MarketingFundamentals_PositioningStatementCreator />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/marketingfundamentals/positioningstatementglobal"
        element={
          <ResizeWrapper>
            <MarketingFundamentals_PositioningStatementGlobal />
          </ResizeWrapper>
        }
      />
    

    <Route
      path="/smotim"
      element={
        
<div className="min-h-screen bg-sky-50 relative flex flex-col justify-start items-center p-8">

  {/* Faint grid background */}
  <div
    className="absolute inset-0 opacity-5 pointer-events-none"
    style={{
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 40px,
        #000 40px,
        #000 41px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 40px,
        #000 40px,
        #000 41px
      )`
    }}
    aria-hidden="true"
  />

  {/* White card */}
  <div className="relative bg-white shadow-2xl px-8 py-10 max-w-3xl w-full">

    {/* Corner brackets */}
    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-600"></div>
    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-600"></div>
    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-600"></div>
    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-600"></div>

    <h2 className="text-3xl font-bold text-red-600 mb-6 uppercase text-center">
      SmoTim module
    </h2>

    <ul className="list-none p-0 text-center space-y-4">
      
      <li>
        <Link
          to="/smotim/aitimeline"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          A I Timeline
        </Link>
      </li>
    
      <li>
        <Link
          to="/smotim/blockchaindemo"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Blockchain Demo
        </Link>
      </li>
    
      <li>
        <Link
          to="/smotim/campaignideas"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Campaign Ideas
        </Link>
      </li>
    
      <li>
        <Link
          to="/smotim/consumerpersona"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Consumer Persona
        </Link>
      </li>
    
      <li>
        <Link
          to="/smotim/dragdroptimeline"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Drag Drop Timeline
        </Link>
      </li>
    
      <li>
        <Link
          to="/smotim/timmodulemap"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Tim Module Map
        </Link>
      </li>
    
    </ul>
  </div>
</div>
  
      }
    />
  

      <Route
        path="/smotim/aitimeline"
        element={
          <ResizeWrapper>
            <SmoTim_AITimeline />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/smotim/blockchaindemo"
        element={
          <ResizeWrapper>
            <SmoTim_BlockchainDemo />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/smotim/campaignideas"
        element={
          <ResizeWrapper>
            <SmoTim_CampaignIdeas />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/smotim/consumerpersona"
        element={
          <ResizeWrapper>
            <SmoTim_ConsumerPersona />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/smotim/dragdroptimeline"
        element={
          <ResizeWrapper>
            <SmoTim_DragDropTimeline />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/smotim/timmodulemap"
        element={
          <ResizeWrapper>
            <SmoTim_TimModuleMap />
          </ResizeWrapper>
        }
      />
    

    <Route
      path="/testapps"
      element={
        
<div className="min-h-screen bg-sky-50 relative flex flex-col justify-start items-center p-8">

  {/* Faint grid background */}
  <div
    className="absolute inset-0 opacity-5 pointer-events-none"
    style={{
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 40px,
        #000 40px,
        #000 41px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 40px,
        #000 40px,
        #000 41px
      )`
    }}
    aria-hidden="true"
  />

  {/* White card */}
  <div className="relative bg-white shadow-2xl px-8 py-10 max-w-3xl w-full">

    {/* Corner brackets */}
    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-red-600"></div>
    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-red-600"></div>
    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-red-600"></div>
    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-red-600"></div>

    <h2 className="text-3xl font-bold text-red-600 mb-6 uppercase text-center">
      TestApps module
    </h2>

    <ul className="list-none p-0 text-center space-y-4">
      
      <li>
        <Link
          to="/testapps/averagecalculator"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Average Calculator
        </Link>
      </li>
    
      <li>
        <Link
          to="/testapps/counterapp"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Counter App
        </Link>
      </li>
    
      <li>
        <Link
          to="/testapps/doublenumber"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Double Number
        </Link>
      </li>
    
      <li>
        <Link
          to="/testapps/fluidai"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Fluid A I
        </Link>
      </li>
    
      <li>
        <Link
          to="/testapps/marketingdashboard"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Marketing Dashboard
        </Link>
      </li>
    
      <li>
        <Link
          to="/testapps/surveybuilder"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Survey Builder
        </Link>
      </li>
    
      <li>
        <Link
          to="/testapps/testapp (copy)"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Test App (copy)
        </Link>
      </li>
    
      <li>
        <Link
          to="/testapps/testapp"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Test App
        </Link>
      </li>
    
      <li>
        <Link
          to="/testapps/toggleswitchapp"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          Toggle Switch App
        </Link>
      </li>
    
    </ul>
  </div>
</div>
  
      }
    />
  

      <Route
        path="/testapps/averagecalculator"
        element={
          <ResizeWrapper>
            <TestApps_AverageCalculator />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/counterapp"
        element={
          <ResizeWrapper>
            <TestApps_CounterApp />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/doublenumber"
        element={
          <ResizeWrapper>
            <TestApps_DoubleNumber />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/fluidai"
        element={
          <ResizeWrapper>
            <TestApps_FluidAI />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/marketingdashboard"
        element={
          <ResizeWrapper>
            <TestApps_MarketingDashboard />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/surveybuilder"
        element={
          <ResizeWrapper>
            <TestApps_SurveyBuilder />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/testapp (copy)"
        element={
          <ResizeWrapper>
            <TestApps_TestApp__copy_ />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/testapp"
        element={
          <ResizeWrapper>
            <TestApps_TestApp />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/toggleswitchapp"
        element={
          <ResizeWrapper>
            <TestApps_ToggleSwitchApp />
          </ResizeWrapper>
        }
      />
    
      </Routes>
    </Router>
  );
}

export default App;
