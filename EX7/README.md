# Exercise 7: Node and Express (P2)

This exercise separates the article and video routes into independent Express
routers, then mounts them from `app.js`.

Install dependencies and start the server:

```sh
npm install
npm start
```

Available route groups:

- `/articles` supports collection and item CRUD routes.
- `/videos` supports collection and item CRUD routes.

The route behavior is the same as Exercise 6, but the route definitions now
live in `routers/articleRouter.js` and `routers/videoRouter.js`.
