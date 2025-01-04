
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
import SmoTim_CampaignIdeas from './apps/SmoTim/CampaignIdeas.js';
import SmoTim_DragDropTimeline from './apps/SmoTim/DragDropTimeline.js';
import SmoTim_TimModuleMap from './apps/SmoTim/TimModuleMap.js';
import TestApps_AverageCalculator from './apps/TestApps/AverageCalculator.js';
import TestApps_CounterApp from './apps/TestApps/CounterApp.js';
import TestApps_DoubleNumber from './apps/TestApps/DoubleNumber.js';
import TestApps_FluidAI from './apps/TestApps/FluidAI.js';
import TestApps_MarketingDashboard from './apps/TestApps/MarketingDashboard.js';
import TestApps_TestApp from './apps/TestApps/TestApp.js';
import TestApps_TestAppCopy from './apps/TestApps/TestAppCopy.js';
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
    "CampaignIdeas.js",
    "DragDropTimeline.js",
    "TimModuleMap.js"
  ],
  "TestApps": [
    "AverageCalculator.js",
    "CounterApp.js",
    "DoubleNumber.js",
    "FluidAI.js",
    "MarketingDashboard.js",
    "TestApp.js",
    "TestAppCopy.js",
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
      '/smotim/campaignideas': 'Campaign Ideas',
      '/smotim/dragdroptimeline': 'Drag Drop Timeline',
      '/smotim/timmodulemap': 'Tim Module Map',
      '/testapps': 'TestApps',
      '/testapps/averagecalculator': 'Average Calculator',
      '/testapps/counterapp': 'Counter App',
      '/testapps/doublenumber': 'Double Number',
      '/testapps/fluidai': 'Fluid A I',
      '/testapps/marketingdashboard': 'Marketing Dashboard',
      '/testapps/testapp': 'Test App',
      '/testapps/testappcopy': 'Test App Copy',
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
            
<div className="text-center p-8 bg-slate-200">
  <h1 className="text-3xl font-bold mb-4">
    Welcome to Interactive Learning Apps
  </h1>

  <nav className="mt-4">

    {/* Only show Modules heading if there's at least one module */}
    {Object.keys(modules).length > 0 && (
      <>
        <h2 className="font-bold text-2xl">Modules</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          
    <li style={{ marginBottom: '1rem' }}>
      <Link to="/marketingfundamentals" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        Marketing Fundamentals
      </Link>
    </li>
  
    <li style={{ marginBottom: '1rem' }}>
      <Link to="/smotim" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        Smo Tim
      </Link>
    </li>
  
    <li style={{ marginBottom: '1rem' }}>
      <Link to="/testapps" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        Test Apps
      </Link>
    </li>
  
        </ul>
      </>
    )}

    {/* Only show Other Apps heading if there's at least one top-level app */}
    {topLevelApps.length > 0 && (
      <>
        <h2 className="font-bold text-2xl">Other apps</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          
    <li style={{ marginBottom: '1rem' }}>
      <Link to="/breakeven" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        Break Even
      </Link>
    </li>
  
        </ul>
      </>
    )}

  </nav>
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
        <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">MarketingFundamentals module</h2>
        <ul className="list-none p-0">
            
                    <li className="mb-3">
                    <Link to="/marketingfundamentals/advertisingtimeline" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Advertising Timeline
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/marketingfundamentals/positioningstatementcreator" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Positioning Statement Creator
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/marketingfundamentals/positioningstatementglobal" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Positioning Statement Global
                    </Link>
                  </li>
                
          </ul>
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
        <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">SmoTim module</h2>
        <ul className="list-none p-0">
            
                    <li className="mb-3">
                    <Link to="/smotim/aitimeline" className="text-xl underline text-blue-600 hover:text-blue-400">
                      A I Timeline
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/smotim/campaignideas" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Campaign Ideas
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/smotim/dragdroptimeline" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Drag Drop Timeline
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/smotim/timmodulemap" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Tim Module Map
                    </Link>
                  </li>
                
          </ul>
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
        path="/smotim/campaignideas"
        element={
          <ResizeWrapper>
            <SmoTim_CampaignIdeas />
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
        <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">TestApps module</h2>
        <ul className="list-none p-0">
            
                    <li className="mb-3">
                    <Link to="/testapps/averagecalculator" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Average Calculator
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/testapps/counterapp" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Counter App
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/testapps/doublenumber" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Double Number
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/testapps/fluidai" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Fluid A I
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/testapps/marketingdashboard" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Marketing Dashboard
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/testapps/testapp" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Test App
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/testapps/testappcopy" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Test App Copy
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/testapps/toggleswitchapp" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Toggle Switch App
                    </Link>
                  </li>
                
          </ul>
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
        path="/testapps/testapp"
        element={
          <ResizeWrapper>
            <TestApps_TestApp />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/testapps/testappcopy"
        element={
          <ResizeWrapper>
            <TestApps_TestAppCopy />
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
