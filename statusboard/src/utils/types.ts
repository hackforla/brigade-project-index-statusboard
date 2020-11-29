// If we also use typescript on the back end, we can move this into a "common" folder (still within the front end bc CRA is opinionated) and use it there too

export type Brigade = {
  name: string,
  website?: string,
  city?: string,
  location?: Location,
  events_url?: string,
  rss?: string,
  projects_list_url?: string,
  projects_tag?: string,
  latitude?: string | number,
  longitude?: string | number,
  tags?: string[],
  social_profiles?: {
    twitter?: string,
    facebook?: string
  },
  projects: Project[]
}

export type Project = {
  name: string,
  description: string,
  link_url: string,
  code_url: string
}

export type Location = {
  city?: string,
  state?: string,
  country?: string,
  continent?: string,
  coordinates?: {
    latitude?: string | number,
    longitude?: string | number
  }
}
