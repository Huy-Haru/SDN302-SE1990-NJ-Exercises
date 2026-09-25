# Exercise 8: Handling errors

This exercise extends the separated article and video routers with centralized
Express error handling. Route middleware creates errors and passes them with
`next(error)`; the final error-handling middleware produces a consistent JSON
response.

```sh
npm install
npm start
```

Try these requests:

- `POST /articles` with `{}` returns `400`.
- `GET /articles/not-a-number` returns `400`.
- `GET /articles/9999` returns `404`.
- A malformed JSON request returns `400`.
- An unknown route returns `404`.

Run the automated checks with `npm test`.
