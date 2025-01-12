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

/**
 * Generate the "module index" page markup in the same style as the homepage:
 *   - Subtle grid background
 *   - White card with red corner brackets
 *   - Link list inside
 * @param {string} moduleName - The folder name of the module
 * @param {string} liTags - The <li> tags (links) to display inside the card
 */
function moduleIndexPageMarkup(moduleName, liTags) {
  return `
<div className="min-h-screen bg-sky-50 relative flex flex-col justify-start items-center p-8">

  {/* Faint grid background */}
  <div
    className="absolute inset-0 opacity-5 pointer-events-none"
    style={{
      backgroundImage: \`repeating-linear-gradient(
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
      )\`
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
      ${moduleName} module
    </h2>

    <ul className="list-none p-0 text-center space-y-4">
      ${liTags}
    </ul>
  </div>
</div>
  `;
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
  // Build <li> items for sub-apps inside the module
  const liTags = modules[moduleName].map(appFile => {
    const route = `/${toRouteName(moduleName)}/${toRouteName(appFile)}`;
    return `
      <li>
        <Link
          to="${route}"
          className="text-xl underline text-red-600 hover:text-red-800"
        >
          ${toNiceTitle(appFile)}
        </Link>
      </li>
    `;
  }).join('');

  // Module's "index" page (the folder menu)
  routesForModules.push(`
    <Route
      path="/${toRouteName(moduleName)}"
      element={
        ${moduleIndexPageMarkup(moduleName, liTags)}
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
        ${toNiceTitle(moduleName)}
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
 */
const homepageElement = `
<div className="min-h-screen bg-sky-50 relative flex flex-col">

  {/* Faint repeating grid background (like AI timeline) */}
  <div
    className="absolute inset-0 opacity-5 pointer-events-none"
    style={{
      backgroundImage: \`repeating-linear-gradient(
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
      )\`
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
              ${moduleLinks
                .replaceAll('style={{ marginBottom: \'1rem\' }}', '')
                .replaceAll(
                  'style={{ fontSize: \'1.2rem\', textDecoration: \'underline\' }}',
                  'className="text-lg font-semibold underline text-red-600 hover:text-red-800 transition-colors"'
                )
              }
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
              ${topLevelLinks
                .replaceAll('style={{ marginBottom: \'1rem\' }}', '')
                .replaceAll(
                  'style={{ fontSize: \'1.2rem\', textDecoration: \'underline\' }}',
                  'className="text-lg font-semibold underline text-blue-700 hover:text-blue-900 transition-colors"'
                )
              }
            </ul>
          </section>
        )}
      </nav>
    </div>
  </div>
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
