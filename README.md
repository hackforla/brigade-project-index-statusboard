# Brigade Project Index Status Board and API

This branch contains a "statusboard" web app that is designed to display ongoing realtime information about each brigade's project-indexing opportunities.

## Running the frontend locally

Once this is in place, you can install and run the app via yarn:

```
yarn install
yarn start
```

To load the discourse tags, you need to run the separate npm task update-cache:

## Running the backend locally

The frontend will by default look for a local copy of the backend API for the React app to load data from.

```
yarn server
```

Currently, the server fetches a new copy of the project index from Github every time (very expensive). If memcached is running locally on port 11211, the API will use this to cache the results. We recommend installing it via Docker:

```
docker run --publish 11211:11211 --detach memcached:alpine
```

You can also tell your local React app to use the production API using an environment variable like this:

```
REACT_APP_API_URL=https://statusboard.brigade.cloud yarn start
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
