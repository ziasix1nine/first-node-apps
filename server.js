
import http from "node:http";

const startTime = Date.now();
const port = Number(process.argv[2] || process.env.PORT || 3000);

function send(res, status, contentType, body) {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(body);
}

function escapeHTML(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function capitalizeWords(text) {
  return text.toLowerCase().replace(/\b[a-z]/g, (letter) =>
    letter.toUpperCase()
  );
}

const server = http.createServer((req, res) => {
  const started = Date.now();

  res.on("finish", () => {
    console.log(
      `${req.method} ${req.url} ${res.statusCode} ${Date.now() - started}ms`
    );
  });

  if (req.method !== "GET") {
    res.writeHead(405, {
      "Content-Type": "text/plain; charset=utf-8",
      Allow: "GET",
    });
    res.end("Method Not Allowed");
    return;
  }

  let pathname;

  try {
    pathname = new URL(req.url, "http://localhost").pathname;
  } catch {
    send(res, 400, "text/plain; charset=utf-8", "Bad Request");
    return;
  }

  if (pathname === "/") {
    send(
      res,
      200,
      "text/html; charset=utf-8",
      `<h1>Welcome to my Node.js server!</h1>
      <ul>
        <li><a href="/hello/ada%20lovelace">Hello route</a></li>
        <li><a href="/api/time">Current time</a></li>
        <li><a href="/health">Health check</a></li>
        <li><a href="/api/playlist">My playlist</a></li>
      </ul>`
    );
    return;
  }

  if (pathname.startsWith("/hello/")) {
    try {
      const name = decodeURIComponent(pathname.slice(7));

      if (!name) {
        send(res, 400, "text/plain; charset=utf-8", "Bad Request");
        return;
      }

      const safeName = escapeHTML(capitalizeWords(name));
      send(res, 200, "text/html; charset=utf-8", `<h1>Hello ${safeName}!</h1>`);
    } catch {
      send(res, 400, "text/plain; charset=utf-8", "Bad Request");
    }
    return;
  }

  if (pathname === "/api/time") {
    send(
      res,
      200,
      "application/json",
      JSON.stringify({
        time: new Date().toISOString(),
        uptime: Math.floor((Date.now() - startTime) / 1000),
      })
    );
    return;
  }

  if (pathname === "/health") {
    send(res, 200, "text/plain; charset=utf-8", "OK");
    return;
  }

  if (pathname === "/api/playlist") {
    send(
      res,
      200,
      "application/json",
      JSON.stringify({
        name: "My Favorite Playlist",
        genre: "Mixed",
        songs: ["Song One", "Song Two", "Song Three"],
      })
    );
    return;
  }

  if (pathname === "/favicon.ico") {
    send(res, 404, "text/plain; charset=utf-8", "Not Found");
    return;
  }

  send(
    res,
    404,
    "text/html; charset=utf-8",
    "<h1>404 - Page Not Found</h1><p>Sorry, this page does not exist.</p>"
  );
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
