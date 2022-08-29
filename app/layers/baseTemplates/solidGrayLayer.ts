export const solidGrayLayer: mapboxgl.LineLayer = {
    id: 'solidGrayLayer',
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