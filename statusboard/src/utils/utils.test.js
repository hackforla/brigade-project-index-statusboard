import { getProjectsFromBrigadeData } from './utils';

const SAMPLE_PROJECT = {
  code_url: 'https://github.com/BetaNYC/311-index',
  git_branch: 'master',
  git_url: 'git://github.com/BetaNYC/311-index.git',
  name: '311-index',
  brigade: 'BetaNYC',
  brigade_slug: 'betanyc',
};

export const SAMPLE_BRIGADE = {
  city: 'New York, NY',
  events_url: 'https://www.meetup.com/betanyc/',
  latitude: '40.7144',
  longitude: '-74.0060',
  name: 'BetaNYC',
  projects_list_url: 'https://github.com/betanyc',
  rss: 'https://beta.nyc/category/blog/rss',
  tags: [
    'Brigade',
    'Code for America',
    'Code for America Fiscally Sponsored Brigade',
    'Official',
  ],
  type:
    'Brigade, Code for America, Code for America Fiscally Sponsored Brigade, Official',
  website: 'https://beta.nyc/',
  location: {
    city: 'New York',
    continent: 'North America',
    country: 'USA',
    state: 'New York',
    coordinates: {
      latitude: '40.7144',
      longitude: '-74.0060',
    },
  },
  social_profiles: {
    facebook: 'https://www.facebook.com/BetaNYC/',
  },
  projects: [SAMPLE_PROJECT],
  slug: 'betanyc',
};

export const SAMPLE_BRIGADES = [
  SAMPLE_BRIGADE,
  {
    city: 'Tulsa, OK',
    events_url: 'https://www.meetup.com/Code-for-Tulsa/',
    latitude: '36.1540',
    longitude: '-95.9928',
    name: 'Code for Tulsa',
    projects_list_url: 'https://github.com/codefortulsa',
    rss:
      'https://google.com/alerts/feeds/06912685966400056337/16695061524097683340',
    tags: [
      'Brigade',
      'Code for America',
      'Code for America Fiscally Sponsored Brigade',
      'Official',
    ],
    type:
      'Brigade, Code for America, Code for America Fiscally Sponsored Brigade, Official',
    website: 'https://codefortulsa.org/',
    location: {
      city: 'Tulsa',
      continent: 'North America',
      country: 'USA',
      state: 'Oklahoma',
      coordinates: { latitude: '36.1540', longitude: '-95.9928' },
    },
    social_profiles: {
      facebook: 'https://www.facebook.com/CodeForTulsa/',
      twitter: '@CodeForTulsa',
    },
    projects: [
      {
        code_url: 'https://github.com/codefortulsa/courtbot-python',
        description:
          'This is an experimental reimplementation of courtbot using python.',
        git_branch: 'master',
        git_url: 'git://github.com/codefortulsa/courtbot-python.git',
        last_pushed_within: 'month',
        link_url: 'http://court.bot/',
        name: 'courtbot-python',
        organization_name: 'Code for Tulsa',
        topics: [
          'civictechindex',
          'code-for-america',
          'code-for-tulsa',
          'courtbot',
          'courtbot-python',
          'court-reminder',
          'criminal-justice',
          'twilio',
        ],
        brigade: 'Code for Tulsa',
        brigade_slug: 'code-for-tulsa',
      },
    ],
    slug: 'code-for-tulsa',
  },
];

test('getProjectsFromBrigadeData', () => {
  const result = getProjectsFromBrigadeData([SAMPLE_BRIGADE]);
  const expected = [
    { ...SAMPLE_PROJECT, brigade: { ...SAMPLE_BRIGADE, projects: undefined } },
  ];

  expect(result).toEqual(expected);
});
