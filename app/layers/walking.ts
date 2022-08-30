export const walkingActive: mapboxgl.LineLayer = {
  id: 'walking',
  type: 'line',
  layout: {
    'line-cap': 'round',
  },
  paint: {
    'line-dasharray': [0, 2],
    'line-color': '#20ba44',
    'line-gradient': [
      'interpolate',
      ['linear'],
      ['line-progress'],
      0,
      '#20ba44',
      1,
      '#20dc44',
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

export const walkingInactive: mapboxgl.LineLayer = {
  id: 'walking',
  type: 'line',
  layout: {
    'line-cap': 'round',
  },
  paint: {
    'line-color': '#a0a0a0',
    'line-dasharray': [0, 2],
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