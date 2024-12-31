/**
 * update-app.js
 *
 * Run `node update-app.js` in your project root.
 * It will generate/overwrite `src/App.js` with dynamically built routes
 * for all top-level JS apps and any module subfolders under `src/apps`.
 */

const fs = require('fs');
const path = require('path');

// --------------------------
// CONFIG: Adjust if needed
// --------------------------
const appsDir = path.join(__dirname, 'src', 'apps');
const appJsPath = path.join(__dirname, 'src', 'App.js');

// --------------------------
// HELPER FUNCTIONS
// --------------------------
function stripExtension(filename) {
  return filename.replace('.js', '');
}

/**
 * For route paths, we just want lowercase versions
 * of the filename or folder name (minus the .js).
 */
function toRouteName(str) {
  return stripExtension(str).toLowerCase();
}

/**
 * Insert spaces before capital letters for a "nice" display.
 * E.g., "MyApp.js" -> "My App", "CampaignIdeas.js" -> "Campaign Ideas".
 */
function toNiceTitle(str) {
  const base = stripExtension(str);
  return base.replace(/([A-Z])/g, ' $1').trim();
}

// --------------------------
// 1. DISCOVER APPS & MODULES
// --------------------------
const topLevelApps = [];
const modules = {};

const items = fs.readdirSync(appsDir, { withFileTypes: true });
items.forEach(dirent => {
  if (dirent.isDirectory()) {
    const moduleName = dirent.name; // e.g. "ModuleA"
    const subDir = path.join(appsDir, moduleName);
    const filesInModule = fs
      .readdirSync(subDir)
      .filter(file => file.endsWith('.js'));

    if (filesInModule.length > 0) {
      modules[moduleName] = filesInModule; // e.g. { "ModuleA": ["SomeApp.js", "Another.js"] }
    }
  } else if (dirent.isFile() && dirent.name.endsWith('.js')) {
    topLevelApps.push(dirent.name); // e.g. "MyApp.js"
  }
});

// --------------------------
// 2. BUILD IMPORT LINES
// --------------------------
const importLines = [];
importLines.push(`import React from 'react';`);
importLines.push(`import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';`);
importLines.push(`import ResizeWrapper from './ResizeWrapper';`);
importLines.push(`import { useEffect } from 'react';`);
importLines.push(`import { useLocation } from 'react-router-dom';`);

// For top-level apps
topLevelApps.forEach(filename => {
  const baseName = stripExtension(filename);
  importLines.push(`import ${baseName} from './apps/${filename}';`);
});

// For module apps
const moduleImports = {};
Object.keys(modules).forEach(moduleName => {
  modules[moduleName].forEach(filename => {
    const baseName = stripExtension(filename);
    // Create a unique variable name for each import
    const importVar = `${moduleName}_${baseName}`.replace(/[^a-zA-Z0-9_]/g, '_');
    importLines.push(`import ${importVar} from './apps/${moduleName}/${filename}';`);
    if (!moduleImports[moduleName]) {
      moduleImports[moduleName] = {};
    }
    moduleImports[moduleName][baseName] = importVar;
  });
});

// --------------------------
// 3. PREPARE DATA FOR DYNAMIC TITLE (Optional)
// --------------------------
const titleEntries = [];

// For top-level apps
topLevelApps.forEach(filename => {
  titleEntries.push(`'/${toRouteName(filename)}': '${toNiceTitle(filename)}'`);
});

// For modules themselves => raw folder name
Object.keys(modules).forEach(moduleName => {
  titleEntries.push(`'/${toRouteName(moduleName)}': '${moduleName}'`);

  // For each app inside the module => nice title
  modules[moduleName].forEach(filename => {
    titleEntries.push(
      `'/${toRouteName(moduleName)}/${toRouteName(filename)}': '${toNiceTitle(filename)}'`
    );
  });
});

const dynamicTitleComponent = `
function DynamicTitle() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      ${titleEntries.join(',\n      ')}
    };
    document.title = titles[location.pathname] || 'Interactive Learning Apps';
  }, [location]);

  return null;
}
`;

// --------------------------
// 4. GENERATE ROUTE ELEMENTS
// --------------------------

// Top-level app routes
const routesForTopLevel = topLevelApps.map(filename => {
  const baseName = stripExtension(filename);
  return `
  <Route
    path="/${toRouteName(filename)}"
    element={
      <ResizeWrapper>
        <${baseName} />
      </ResizeWrapper>
    }
  />`;
}).join('');

// Module routes
const routesForModules = [];
Object.keys(modules).forEach(moduleName => {
  // Module's "index" page
  routesForModules.push(`
    <Route
      path="/${toRouteName(moduleName)}"
      element={
        <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">${moduleName} module</h2>
        <ul className="list-none p-0">
            ${
              modules[moduleName].map(appFile => {
                const route = `/${toRouteName(moduleName)}/${toRouteName(appFile)}`;
                return `
                    <li className="mb-3">
                    <Link to="${route}" className="text-xl underline text-blue-600 hover:text-blue-400">
                      ${toNiceTitle(appFile)}
                    </Link>
                  </li>
                `;
              }).join('')
            }
          </ul>
        </div>
      }
    />
  `);

  // A route for each app within the module
  modules[moduleName].forEach(filename => {
    const baseName = stripExtension(filename);
    const importVar = moduleImports[moduleName][baseName];
    routesForModules.push(`
      <Route
        path="/${toRouteName(moduleName)}/${toRouteName(filename)}"
        element={
          <ResizeWrapper>
            <${importVar} />
          </ResizeWrapper>
        }
      />
    `);
  });
});

// --------------------------
// 5. HOMEPAGE LINKS
// --------------------------
const moduleLinks = Object.keys(modules).map(moduleName => {
  const route = `/${toRouteName(moduleName)}`;
  return `
    <li style={{ marginBottom: '1rem' }}>
      <Link to="${route}" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        ${moduleName}
      </Link>
    </li>
  `;
}).join('');

const topLevelLinks = topLevelApps.map(filename => {
  const route = `/${toRouteName(filename)}`;
  return `
    <li style={{ marginBottom: '1rem' }}>
      <Link to="${route}" style={{ fontSize: '1.2rem', textDecoration: 'underline' }}>
        ${toNiceTitle(filename)}
      </Link>
    </li>
  `;
}).join('');

/**
 * This is the JSX that goes in the "homepage" route (path="/").
 * Notice references to 'modules' and 'topLevelApps'. We need
 * to inject them as constants in the final output so we can do
 * {Object.keys(modules).length > 0 && ...} safely in runtime.
 */
const homepageElement = `
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
          ${moduleLinks}
        </ul>
      </>
    )}

    {/* Only show Other Apps heading if there's at least one top-level app */}
    {topLevelApps.length > 0 && (
      <>
        <h2 className="font-bold text-2xl">Other apps</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          ${topLevelLinks}
        </ul>
      </>
    )}

  </nav>
</div>
`;

// --------------------------
// 6. INJECT modules & topLevelApps into the final code
// so that "App.js" has them as actual variables.
// --------------------------
const modulesJSON = JSON.stringify(modules, null, 2);
const topLevelAppsJSON = JSON.stringify(topLevelApps, null, 2);

// --------------------------
// 7. BUILD THE FINAL App.js CONTENT
// --------------------------
const appJsContent = `
${importLines.join('\n')}

/**
 * We define these constants so the JSX can reference them
 * (and won't throw "no-undef" errors).
 */
const modules = ${modulesJSON};
const topLevelApps = ${topLevelAppsJSON};

${dynamicTitleComponent}

function App() {
  return (
    <Router>
      <DynamicTitle />
      <Routes>
        {/* The homepage */}
        <Route
          path="/"
          element={
            ${homepageElement}
          }
        />

        {/* Top-level app routes */}
        ${routesForTopLevel}

        {/* Module routes */}
        ${routesForModules.join('\n')}
      </Routes>
    </Router>
  );
}

export default App;
`;

// --------------------------
// 8. WRITE OUT THE GENERATED App.js
// --------------------------
fs.writeFileSync(appJsPath, appJsContent, 'utf-8');
console.log('Successfully updated src/App.js with dynamic module/app routing!');
