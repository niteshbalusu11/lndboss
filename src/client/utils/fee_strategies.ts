export const configs = {
  defaultConfig: {
    configs: [
      {
        name: 'Default',
        config: {
          strategy: 'static',
          fee_ppm: 200,
          id: ['xxx', 'yyy'],
        },
      },
    ],
  },
  activityConfig: {
    configs: [
      {
        name: 'Default',
        config: {
          strategy: 'static',
          fee_ppm: 200,
          id: ['xxx', 'yyy'],
        },
      },
      {
        name: 'low-out-flow',
        config: {
          activity_period: '15d',
          strategy: 'static',
          fee_ppm: 100,
        },
      },
      {
        name: 'very-low-out-flow',
        config: {
          activity_period: '7d',
          strategy: 'static',
          fee_ppm: 100,
        },
      },
    ],
  },
  staticConfig: {
    configs: [
      {
        name: 'Default',
        config: {
          strategy: 'static',
          fee_ppm: 200,
          id: ['xxx', 'yyy'],
        },
      },
    ],
  },
};
