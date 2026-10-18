
# First Node Apps

Node.js command-line tip calculator and HTTP web server.

## Requirements

- Node.js LTS
- npm
- curl.exe (Windows)

## Setup

```bash
npm install
```

## Run the tip calculator

```bash
node tipcalc.js 84.50 20 3
node tipcalc.js --help
```

## Run the web server

```bash
npm run dev
```

Open http://localhost:3000/ in your browser.

## Routes

- `/` — Home page
- `/hello/ada%20lovelace` — Greeting
- `/api/time` — Current time and uptime in JSON
- `/health` — Health check
- `/api/playlist` — Custom playlist JSON
- `/favicon.ico` — 404 response
- Unknown URLs — 404 response
- Non-GET methods — 405 response

## Task 1 Test Log

Add at least 8 tests here. For each, record the exact command, actual output, and exit code copied from your terminal.

## Task 2 Test Log

Paste the actual output from every required `curl.exe -i` test here, along with the matching server request logs.

Also include proof that Nodemon restarts after you change the playlist route.

## Reflections

### Why should unknown URLs return 404?

Unknown URLs should return a 404 status because the requested resource does not exist. Browsers, API clients, and automated tools use status codes to understand whether a request succeeded. Returning 200 for a missing page could mislead software into treating the request as successful. The 404 status clearly communicates that the resource was not found.

### What caused the malformed URL crash, and how was it fixed?

The malformed URL contained invalid percent-encoded characters. Calling decodeURIComponent() on invalid encoding can throw a URIError. I handled the decoding inside a try...catch block and returned a 400 Bad Request response instead of allowing the server to crash. I then tested the malformed URL and confirmed the server continued responding to health checks.

### Why should production servers be stateless?

When multiple server instances run behind a load balancer, each instance has its own memory. A visit counter stored in a variable would therefore have different values on different instances. Instead, shared state should be stored in a common database or another shared storage system. This allows all server instances to access consistent data.