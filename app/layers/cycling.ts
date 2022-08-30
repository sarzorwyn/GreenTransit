export const cyclingActive: mapboxgl.LineLayer = {
  id: 'cycling',
  type: 'line',
  layout: {
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#d3db2e',
    'line-gradient': [
      'interpolate',
      ['linear'],
      ['line-progress'],
      0,
      '#d3db2e',
      1,
      '#cbd41c',
    ],
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      ['boolean', ['feature-state', 'fadein'], false],
      0.07,
      0.9, // default
    ],
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      12,
      5,
      16,
      13,
      22,
      25,
    ],
  },
}

export const cyclingInactive: mapboxgl.LineLayer = {
  id: 'cycling',
  type: 'line',
  layout: {
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#a0a0a0',
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      1,
      ['boolean', ['feature-state', 'fadein'], false],
      0.07,
      0.5, // default
    ],
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      12,
      5,
      16,
      13,
      22,
      25,
    ],
  },
}