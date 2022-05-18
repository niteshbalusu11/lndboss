import React from 'react';
import commands from '../commands';
import ResponsiveGrid from '../standard_components/ResponsiveGrid';

const Grid = () => {
  return <ResponsiveGrid gridArray={commands} />;
};

export default Grid;
