import React, { useEffect } from 'react';
import { initiateAutoResize, disconnectAutoResize } from './resizeHelper';

const ResizeWrapper = ({ children }) => {
  useEffect(() => {
    // Start observing for resize changes on mount
    initiateAutoResize();

    // Cleanup observer on component unmount
    return () => {
      disconnectAutoResize();
    };
  }, []);

  return <div>{children}</div>;
};

export default ResizeWrapper;
