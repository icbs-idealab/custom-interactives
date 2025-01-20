import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

const TShapedTemplate = () => {
  const [broadSkills, setBroadSkills] = useState(['', '', '']);
  const [deepSkills, setDeepSkills] = useState(['', '', '']);
  const contentRef = useRef(null);

  const handleBroadSkillChange = (index, value) => {
    const newSkills = [...broadSkills];
    newSkills[index] = value;
    setBroadSkills(newSkills);
  };

  const handleDeepSkillChange = (index, value) => {
    const newSkills = [...deepSkills];
    newSkills[index] = value;
    setDeepSkills(newSkills);
  };

  const takeScreenshot = async () => {
    if (contentRef.current) {
      try {
        const canvas = await html2canvas(contentRef.current, {
          backgroundColor: 'white',
          scale: 2,
          logging: false,
          windowWidth: contentRef.current.scrollWidth,
          windowHeight: contentRef.current.scrollHeight,
          y: window.scrollY,
          padding: 20
        });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 't-shaped-skills.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error taking screenshot:', err);
      }
    }
  };

  const desktopInputWidth = '320px';

  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto p-12">
        <h1 className="text-2xl text-blue-600 text-center mb-12">
          What kind of T-shaped marketer will you be?
        </h1>

        <div ref={contentRef} className="space-y-12">
          {/* Broad skills section */}
          <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4 px-4 md:px-0 md:text-center">Broad skills</h2>            
            {/* Desktop layout */}
            <div className="hidden md:block">
              <div className="flex justify-center gap-8">
                {broadSkills.map((skill, index) => (
                  <div key={`broad-${index}`} style={{ width: desktopInputWidth }}>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleBroadSkillChange(index, e.target.value)}
                      placeholder={`Broad skill ${index + 1}`}
                      aria-label={`Broad skill ${index + 1}`}
                      className="px-4 py-3 border-2 border-gray-200 rounded focus:border-blue-500 focus:outline-none text-base leading-relaxed h-14 mb-2 w-full"
                      style={{
                        lineHeight: '1.5',
                        minHeight: '56px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden space-y-4 px-4">
              {broadSkills.map((skill, index) => (
                <div key={`broad-${index}`} className="w-full">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleBroadSkillChange(index, e.target.value)}
                    placeholder={`Broad skill ${index + 1}`}
                    aria-label={`Broad skill ${index + 1}`}
                    className="px-4 py-3 border-2 border-gray-200 rounded focus:border-blue-500 focus:outline-none text-base leading-relaxed h-14 mb-2 w-full"
                    style={{
                      lineHeight: '1.5',
                      minHeight: '56px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Deep skills section */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-4 px-4 md:px-0 md:text-center">Deep skills</h2>
            
            {/* Desktop layout */}
            <div className="hidden md:flex md:justify-center">
              <div style={{ width: desktopInputWidth }}>
                <div className="space-y-6">
                  {deepSkills.map((skill, index) => (
                    <input
                      key={`deep-${index}`}
                      type="text"
                      value={skill}
                      onChange={(e) => handleDeepSkillChange(index, e.target.value)}
                      placeholder={`Deep expertise ${index + 1}`}
                      aria-label={`Deep expertise ${index + 1}`}
                      className="px-4 py-3 border-2 border-gray-200 rounded focus:border-blue-500 focus:outline-none text-base leading-relaxed h-14 mb-2 w-full"
                      style={{
                        lineHeight: '1.5',
                        minHeight: '56px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden space-y-4 px-4">
              {deepSkills.map((skill, index) => (
                <div key={`deep-${index}`} className="w-full">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleDeepSkillChange(index, e.target.value)}
                    placeholder={`Deep expertise ${index + 1}`}
                    aria-label={`Deep expertise ${index + 1}`}
                    className="px-4 py-3 border-2 border-gray-200 rounded focus:border-blue-500 focus:outline-none text-base leading-relaxed h-14 mb-2 w-full"
                    style={{
                      lineHeight: '1.5',
                      minHeight: '56px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={takeScreenshot}
          className="mt-12 flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Save as image
        </button>
      </div>
    </div>
  );
};

export default TShapedTemplate;