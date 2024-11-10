const fs = require('fs');
const path = require('path');

// Paths to the apps directory and App.js
const appsDir = path.join(__dirname, 'src', 'apps');
const appJsPath = path.join(__dirname, 'src', 'App.js');

// Read all .js files in the apps directory
const files = fs.readdirSync(appsDir).filter(file => file.endsWith('.js'));

// Generate imports for each app and the ResizeWrapper
const imports = `import ResizeWrapper from './ResizeWrapper';\n` +
                files.map(file => `import ${path.basename(file, '.js')} from './apps/${file}';`).join('\n');

// Generate routes wrapped in ResizeWrapper
const routes = files
  .map(file => {
    const routeName = path.basename(file, '.js').toLowerCase();
    return `<Route path="/${routeName}" element={<ResizeWrapper><${path.basename(file, '.js')} /></ResizeWrapper>} />`;
  })
  .join('\n        ');

// Generate links for each app
const links = files
  .map(file => {
    const linkName = path.basename(file, '.js');
    const routeName = linkName.toLowerCase();
    return `<li style={{ marginBottom: '1rem' }}><Link to="/${routeName}" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>${linkName.replace(/([A-Z])/g, ' $1')}</Link></li>`;
  })
  .join('\n                ');

// Template for the App.js content
const appJsContent = `
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

${imports}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h1>Welcome to Interactive Learning Apps</h1>
              <p>Select an app to get started:</p>
              <nav style={{ marginTop: '1rem' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  ${links}
                </ul>
              </nav>
            </div>
          }
        />
        ${routes}
      </Routes>
    </Router>
  );
}

export default App;
`;

// Write the updated App.js content
fs.writeFileSync(appJsPath, appJsContent);
console.log('App.js updated with new routes and links!');
