import { getProjectsFromBrigadeData } from './utils';

const SAMPLE_PROJECT = {
  "code_url": "https://github.com/BetaNYC/311-index",
  "git_branch": "master",
  "git_url": "git://github.com/BetaNYC/311-index.git",
  "name": "311-index",
  "brigade": "BetaNYC",
  "brigade_slug": "betanyc"
};

const SAMPLE_BRIGADE = {
  "city": "New York, NY",
  "events_url": "https://www.meetup.com/betanyc/",
  "latitude": "40.7144",
  "longitude": "-74.0060",
  "name": "BetaNYC",
  "projects_list_url": "https://github.com/betanyc",
  "rss": "https://beta.nyc/category/blog/rss",
  "tags": [
    "Brigade", "Code for America", "Code for America Fiscally Sponsored Brigade", "Official"
  ],
  "type": "Brigade, Code for America, Code for America Fiscally Sponsored Brigade, Official",
  "website": "https://beta.nyc/",
  "location": {
    "city": "New York",
    "continent": "North America",
    "country": "USA",
    "state": "New York",
    "coordinates": {
      "latitude": "40.7144",
      "longitude": "-74.0060"
    }
  },
  "social_profiles": {
    "facebook": "https://www.facebook.com/BetaNYC/"
  },
  "projects": [SAMPLE_PROJECT],
  "slug": "betanyc",
};

test('getProjectsFromBrigadeData', () => {
  const result = getProjectsFromBrigadeData([SAMPLE_BRIGADE]);

  const expected = [
    { ...SAMPLE_PROJECT, brigade: { ...SAMPLE_BRIGADE, projects: undefined } },
  ];

  expect(result).toEqual(expected);
});
