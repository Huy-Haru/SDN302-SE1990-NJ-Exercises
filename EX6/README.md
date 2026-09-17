# Exercise 6: Node and Express (P1)

Requires Node.js 18 or newer. Install dependencies:

```sh
cd EX6
npm ci
```

## Exercise 1: Read and update a JSON file

```sh
npm run start:data
```

This runs `server.js` at http://localhost:3000.

- `GET /data`: return the contents of `data.json`.
- `POST /update`: replace `data.json` with the JSON object in the request body.

In Postman, select Body > raw > JSON and send:

```json
{
  "message": "Updating with a new message!"
}
```

The response is `{"message":"The data has been updated"}`. Send `GET /data`
again to verify the update. Changes remain after restarting the server.
The file path is relative to `server.js`, so starting from another directory works.

## Exercises 2 and 3: Articles and videos CRUD

Stop the data server with Ctrl+C, then run:

```sh
npm start
```

This runs `app.js` at http://localhost:3000. Both servers default to port 3000;
run them separately or set a different `PORT` environment variable.

`articles.js` and `videos.js` load the respective collections from the supplied
`db.json`. Express routers are defined in `app.js`. CRUD changes are held in memory,
as in the exercise's array-based example; restarting restores the seed data.

Replace `articles` with `videos` to use the same routes for videos:

| Method | Route | Result |
| --- | --- | --- |
| GET | `/articles` | 200, all articles |
| POST | `/articles` | 201, create and return an article with a generated ID |
| PUT | `/articles` | 403, collection update is unsupported |
| DELETE | `/articles` | 200, delete all articles |
| GET | `/articles/:id` | 200, return one article |
| POST | `/articles/:id` | 403, creation at a specific ID is unsupported |
| PUT | `/articles/:id` | 200, update supplied fields, preserving the ID |
| DELETE | `/articles/:id` | 204, delete one article, no response body |

Missing items return 404; invalid IDs, invalid JSON, or invalid request bodies
return 400. POST requires a non-empty `title`. PUT validates `title` when supplied.

Example POST body for `/articles` (the screenshot's `text` field is also accepted):

```json
{
  "title": "My Favorite Vacation",
  "date": "2024-03-10",
  "author": "Jane Doe",
  "content": "We spent seven days in Italy...",
  "comments": []
}
```

For `/videos`, use the same fields and add:

```json
{
  "title": "Exploring Paris",
  "date": "2024-03-10",
  "video": "https://www.youtube.com/embed/hLluNp5xlJE",
  "content": "A travel video"
}
```

Use the returned ID for GET, PUT, and DELETE requests. The DELETE route consistently
uses `/articles/:id`; the hint's singular `/article/:id` is a typo.

## Verification

```sh
npm test
```

Tests send real HTTP requests on temporary ports, cover both CRUD collections and
file persistence, and use a temporary data file so `data.json` stays unchanged.
