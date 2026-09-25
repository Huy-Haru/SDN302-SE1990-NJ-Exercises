# Exercise 9: Custom middleware

This exercise adds reusable validation middleware to the article routes. The
middleware is separated into `middleware/articleValidation.js` and checks the
request body before the route handler runs.

```sh
npm install
npm start
```

`POST /articles` and `PUT /articles/:id` require:

- non-empty string fields: `title`, `date`, and `text`;
- a real calendar date in `YYYY-MM-DD` format;
- `text` between 10 and 1000 characters after trimming.

Invalid input returns `400` with a JSON `error` message. Run `npm test` to
exercise the success and failure cases.
