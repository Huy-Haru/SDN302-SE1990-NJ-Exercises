# Exercise 3: HTTP server and clients

Install dependencies and start the server:

```sh
cd EX3
npm ci
npm start
```

Open http://127.0.0.1:3000 in a browser. The response is `Hello World`
with HTTP status `200` and content type `text/plain`.

Keep the server running and open another terminal in `EX3`:

```sh
npm run client
npm run client:axios
```

The native HTTP client prints `statusCode: 200` and `Hello World`.
The Axios client prints `Hello World`. Stop the server with Ctrl+C.

`http` is built into Node.js; only Axios needs to be installed.
