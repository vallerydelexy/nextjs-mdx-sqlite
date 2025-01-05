import React from 'react';

export default function Logo({ className }) {
  return React.createElement('svg', {
    className: className,
    xmlns: 'http://www.w3.org/2000/svg',
    'xmlSpace': 'preserve',
    version: '1.1',
    style: {
      shapeRendering: 'geometricPrecision',
      textRendering: 'geometricPrecision',
      imageRendering: 'optimizeQuality',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    },
    viewBox: '0 0 6000 7400',
    xmlns_xlink: 'http://www.w3.org/1999/xlink',
  },
  // Move the child elements here as additional arguments
  React.createElement('g', { id: 'Layer_x0020_1' },
    React.createElement('metadata', { id: 'CorelCorpID_0Corel-Layer' }),
    React.createElement('path', { className: 'fil0', d: 'M4402.28 3226.69c-1693.32,1396.98 -2794,1799.17 -2794,1799.17 731.59,-452.64 3531.4,-2155.17 3134.63,-3140.98 -383.39,-952.56 -2279.16,-201.19 -3410.28,-342.5 -684.52,-85.51 -744.39,-1034.66 -49.29,-1233.57 1044.13,-298.8 4252.18,-466.85 4540.51,843.23 120.53,547.62 -370.09,1207.19 -1421.57,2074.65z' }),
    React.createElement('path', { className: 'fil0', d: 'M841 1776.77c0,0 1608.67,1905 -751.42,5524.5 561.98,-2939.11 730.25,-3397.24 751.42,-5524.5z' }),
    React.createElement('path', { className: 'fil0', d: 'M1539.5 1999.02c2155.52,3106.92 3861.25,1388.71 4370.92,5217.58 -607.57,-2080.36 -4562.98,-2208.51 -4370.92,-5217.58z' }),
  ));
}
