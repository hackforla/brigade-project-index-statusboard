<a href="https://github.com/codeforamerica/brigade-project-index-statusboard/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22" alt="Contributors"><img src="https://img.shields.io/github/issues/codeforamerica/brigade-project-index-statusboard/good%20first%20issue?label=good%20first%20issue" /></a>

# Brigade Project Index Statusboard and API

This repo contains two things:
1. A `statusboard` web app to display ongoing realtime information about Brigade projects
2. An `api` to download data from the [brigade-project-index](https://github.com/codeforamerica/brigade-project-index/tree/index/v1) and expose it via JSON API

The statusboard is running in production at https://projects.brigade.network and the API is accessible at https://statusboard.brigade.cloud.

The [Project Index Working Group](https://brigade.cloud/) has bi-weekly video meetings and can be found in the Code for America [#brigade-project-index Slack channel](https://cfa.slack.com/archives/CLMA6BAVB).

## Running the Statusboard locally

The Statusboard is a Create-React-App, and supports their built-in commands, including `yarn test` and `yarn build`.

You can install the app and run it with,

```
cd statusboard
yarn install
yarn start
```

By default, the front-end will look for a **local copy of the backend API** for the React app to load data from, but you
don't have to run the API locally. You can instead tell your local React app to use the online production API with an
environment variable like this:

```
REACT_APP_API_URL=https://statusboard.brigade.cloud
```

or by using

```
yarn start-remote-api
```

instead of `yarn start`.

## Running the API locally

If you choose to run the API locally (the default behaviour),
you will need to use an older version of Node;
install [NVM](https://github.com/nvm-sh/nvm) and run:

```
cd api
nvm install 12
nvm use 12
yarn install
yarn start
```

Currently, the server fetches a new copy
of the project index from Github every time (very expensive).
If redis is running locally on port 6379,
the API will use this to cache the results.
We recommend installing and running Redis via Docker:

```
docker run --publish 6379:6379 redis:alpine
```

## Other commands

```
npm run update-cache
```

This builds both the projectIndex cache and tags cache (data.json and tags.json respectively), and in deployment is run on a scheduler every 10 min.

To run the test suite, run:

```
yarn test
```

To access the server, use:

```
curl http://localhost:8080/api/data.json
```
