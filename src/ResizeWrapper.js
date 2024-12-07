// src/ResizeWrapper.js
import React, { useEffect, useRef } from 'react';
import { initiateAutoResize } from './resizeHelper';

const ResizeWrapper = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Start the auto-resize interval once when the component mounts
    initiateAutoResize();

    // Set up ResizeObserver to detect container size changes and resize if needed
    const resizeObserver = new ResizeObserver(() => {
      initiateAutoResize(); // Ensure height is adjusted when container changes
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current); // Observe main container
    }

    // Cleanup observer on component unmount
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default ResizeWrapper;
