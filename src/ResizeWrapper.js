import React, { useEffect } from 'react';
import { initiateAutoResize } from './resizeHelper';

const ResizeWrapper = ({ children }) => {
  useEffect(() => {
    // Start observing for resize changes when the component mounts
    initiateAutoResize();

    // No need for cleanup here since ResizeObserver in resizeHelper handles it
  }, []);

  return <div>{children}</div>; // No need for a containerRef since #root is being observed
};

export default ResizeWrapper;
