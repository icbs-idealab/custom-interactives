
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResizeWrapper from './ResizeWrapper';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BreakEven from './apps/BreakEven.js';
import Marketing_Fundamentals_AdvertisingTimeline from './apps/Marketing_Fundamentals/AdvertisingTimeline.js';
import Marketing_Fundamentals_PositioningStatementCreator from './apps/Marketing_Fundamentals/PositioningStatementCreator.js';
import Marketing_Fundamentals_PositioningStatementGlobal from './apps/Marketing_Fundamentals/PositioningStatementGlobal.js';
import SMO_TiM_AITimeline from './apps/SMO_TiM/AITimeline.js';
import SMO_TiM_CampaignIdeas from './apps/SMO_TiM/CampaignIdeas.js';
import SMO_TiM_DragDropTimeline from './apps/SMO_TiM/DragDropTimeline.js';
import SMO_TiM_TimModuleMap from './apps/SMO_TiM/TimModuleMap.js';
import Test_Apps_AverageCalculator from './apps/Test_Apps/AverageCalculator.js';
import Test_Apps_CounterApp from './apps/Test_Apps/CounterApp.js';
import Test_Apps_DoubleNumber from './apps/Test_Apps/DoubleNumber.js';
import Test_Apps_FluidAI from './apps/Test_Apps/FluidAI.js';
import Test_Apps_MarketingDashboard from './apps/Test_Apps/MarketingDashboard.js';
import Test_Apps_TestApp from './apps/Test_Apps/TestApp.js';
import Test_Apps_TestAppCopy from './apps/Test_Apps/TestAppCopy.js';
import Test_Apps_TestAppCopyTwo from './apps/Test_Apps/TestAppCopyTwo.js';
import Test_Apps_ToggleSwitchApp from './apps/Test_Apps/ToggleSwitchApp.js';

/**
 * We define these constants so the JSX can reference them
 * (and won't throw "no-undef" errors).
 */
const modules = {
  "Marketing_Fundamentals": [
    "AdvertisingTimeline.js",
    "PositioningStatementCreator.js",
    "PositioningStatementGlobal.js"
  ],
  "SMO_TiM": [
    "AITimeline.js",
    "CampaignIdeas.js",
    "DragDropTimeline.js",
    "TimModuleMap.js"
  ],
  "Test_Apps": [
    "AverageCalculator.js",
    "CounterApp.js",
    "DoubleNumber.js",
    "FluidAI.js",
    "MarketingDashboard.js",
    "TestApp.js",
    "TestAppCopy.js",
    "TestAppCopyTwo.js",
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
      '/marketing_fundamentals': 'Marketing_Fundamentals',
      '/marketing_fundamentals/advertisingtimeline': 'Advertising Timeline',
      '/marketing_fundamentals/positioningstatementcreator': 'Positioning Statement Creator',
      '/marketing_fundamentals/positioningstatementglobal': 'Positioning Statement Global',
      '/smo_tim': 'SMO_TiM',
      '/smo_tim/aitimeline': 'A I Timeline',
      '/smo_tim/campaignideas': 'Campaign Ideas',
      '/smo_tim/dragdroptimeline': 'Drag Drop Timeline',
      '/smo_tim/timmodulemap': 'Tim Module Map',
      '/test_apps': 'Test_Apps',
      '/test_apps/averagecalculator': 'Average Calculator',
      '/test_apps/counterapp': 'Counter App',
      '/test_apps/doublenumber': 'Double Number',
      '/test_apps/fluidai': 'Fluid A I',
      '/test_apps/marketingdashboard': 'Marketing Dashboard',
      '/test_apps/testapp': 'Test App',
      '/test_apps/testappcopy': 'Test App Copy',
      '/test_apps/testappcopytwo': 'Test App Copy Two',
      '/test_apps/toggleswitchapp': 'Toggle Switch App'
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
      <Link to="/marketing_fundamentals" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        Marketing_Fundamentals
      </Link>
    </li>
  
    <li style={{ marginBottom: '1rem' }}>
      <Link to="/smo_tim" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        SMO_TiM
      </Link>
    </li>
  
    <li style={{ marginBottom: '1rem' }}>
      <Link to="/test_apps" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        Test_Apps
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
      path="/marketing_fundamentals"
      element={
        <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Marketing_Fundamentals module</h2>
        <ul className="list-none p-0">
            
                    <li className="mb-3">
                    <Link to="/marketing_fundamentals/advertisingtimeline" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Advertising Timeline
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/marketing_fundamentals/positioningstatementcreator" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Positioning Statement Creator
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/marketing_fundamentals/positioningstatementglobal" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Positioning Statement Global
                    </Link>
                  </li>
                
          </ul>
        </div>
      }
    />
  

      <Route
        path="/marketing_fundamentals/advertisingtimeline"
        element={
          <ResizeWrapper>
            <Marketing_Fundamentals_AdvertisingTimeline />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/marketing_fundamentals/positioningstatementcreator"
        element={
          <ResizeWrapper>
            <Marketing_Fundamentals_PositioningStatementCreator />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/marketing_fundamentals/positioningstatementglobal"
        element={
          <ResizeWrapper>
            <Marketing_Fundamentals_PositioningStatementGlobal />
          </ResizeWrapper>
        }
      />
    

    <Route
      path="/smo_tim"
      element={
        <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">SMO_TiM module</h2>
        <ul className="list-none p-0">
            
                    <li className="mb-3">
                    <Link to="/smo_tim/aitimeline" className="text-xl underline text-blue-600 hover:text-blue-400">
                      A I Timeline
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/smo_tim/campaignideas" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Campaign Ideas
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/smo_tim/dragdroptimeline" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Drag Drop Timeline
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/smo_tim/timmodulemap" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Tim Module Map
                    </Link>
                  </li>
                
          </ul>
        </div>
      }
    />
  

      <Route
        path="/smo_tim/aitimeline"
        element={
          <ResizeWrapper>
            <SMO_TiM_AITimeline />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/smo_tim/campaignideas"
        element={
          <ResizeWrapper>
            <SMO_TiM_CampaignIdeas />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/smo_tim/dragdroptimeline"
        element={
          <ResizeWrapper>
            <SMO_TiM_DragDropTimeline />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/smo_tim/timmodulemap"
        element={
          <ResizeWrapper>
            <SMO_TiM_TimModuleMap />
          </ResizeWrapper>
        }
      />
    

    <Route
      path="/test_apps"
      element={
        <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Test_Apps module</h2>
        <ul className="list-none p-0">
            
                    <li className="mb-3">
                    <Link to="/test_apps/averagecalculator" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Average Calculator
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/test_apps/counterapp" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Counter App
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/test_apps/doublenumber" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Double Number
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/test_apps/fluidai" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Fluid A I
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/test_apps/marketingdashboard" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Marketing Dashboard
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/test_apps/testapp" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Test App
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/test_apps/testappcopy" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Test App Copy
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/test_apps/testappcopytwo" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Test App Copy Two
                    </Link>
                  </li>
                
                    <li className="mb-3">
                    <Link to="/test_apps/toggleswitchapp" className="text-xl underline text-blue-600 hover:text-blue-400">
                      Toggle Switch App
                    </Link>
                  </li>
                
          </ul>
        </div>
      }
    />
  

      <Route
        path="/test_apps/averagecalculator"
        element={
          <ResizeWrapper>
            <Test_Apps_AverageCalculator />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/test_apps/counterapp"
        element={
          <ResizeWrapper>
            <Test_Apps_CounterApp />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/test_apps/doublenumber"
        element={
          <ResizeWrapper>
            <Test_Apps_DoubleNumber />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/test_apps/fluidai"
        element={
          <ResizeWrapper>
            <Test_Apps_FluidAI />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/test_apps/marketingdashboard"
        element={
          <ResizeWrapper>
            <Test_Apps_MarketingDashboard />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/test_apps/testapp"
        element={
          <ResizeWrapper>
            <Test_Apps_TestApp />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/test_apps/testappcopy"
        element={
          <ResizeWrapper>
            <Test_Apps_TestAppCopy />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/test_apps/testappcopytwo"
        element={
          <ResizeWrapper>
            <Test_Apps_TestAppCopyTwo />
          </ResizeWrapper>
        }
      />
    

      <Route
        path="/test_apps/toggleswitchapp"
        element={
          <ResizeWrapper>
            <Test_Apps_ToggleSwitchApp />
          </ResizeWrapper>
        }
      />
    
      </Routes>
    </Router>
  );
}

export default App;
