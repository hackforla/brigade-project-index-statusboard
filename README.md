# Brigade Project Index Status Board 

This branch contains a "statusboard" web app that is designed to display ongoing realtime information about each brigade's project-indexing opportunities. 

 
## Running It Locally

At this point you need to download and unzip the [index branch](https://github.com/codeforamerica/brigade-project-index/archive/index.zip) into a "./dist/data" folder.

You will also need [memcached](https://github.com/memcachier/memjs#ubuntu) running for the [MemJS](https://github.com/memcachier/memjs) dependency.

Once this is in place, you can install / run the app with the standard npm run commands:

```
npm install .
npm run watch
```

To load the discourse tags, you need to run the separate npm task update-cache:

```
npm run update-cache
```

This builds both the projectIndex cache and tags cache (data.json and tags.json respectively), and in deployment is run on a scheduler every 10 min.


