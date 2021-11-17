// If we also use typescript on the back end, we can move this into a "common" folder (still within the front end bc CRA is opinionated) and use it there too
import { SortByFn,
  Row,
  IdType, } from "react-table";
import { customStringSort,lastPushSort } from "./utils";

export type Brigade = {
  name: string;
  website?: string;
  city?: string;
  location?: Location;
  events_url?: string;
  rss?: string;
  projects_list_url?: string;
  projects_tag?: string;
  latitude?: string | number;
  longitude?: string | number;
  tags?: string[];
  type?: string[];
  social_profiles?: {
    twitter?: string;
    facebook?: string;
  };
  projects?: Project[];
};

export type Project = {
  name: string;
  description?: string;
  link_url?: string;
  code_url?: string;
  topics?: string[];
  brigade?: Brigade;
  last_pushed_within?: string;
  open_issues_within?: number;
};

export type Location = {
  city?: string;
  state?: string;
  country?: string;
  continent?: string;
  coordinates?: {
    latitude?: string | number;
    longitude?: string | number;
  };
};



