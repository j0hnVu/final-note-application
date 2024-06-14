import React, { createContext, useState } from 'react';
import { LABELS } from '../data/dummy-data';

export const LabelsContext = createContext();

export const LabelsProvider = ({ children }) => {
  const [labels, setLabels] = useState(LABELS);

  return (
    <LabelsContext.Provider value={{ labels, setLabels }}>
      {children}
    </LabelsContext.Provider>
  );
};
