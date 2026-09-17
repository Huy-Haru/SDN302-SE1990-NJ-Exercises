const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { once } = require("node:events");
const createApp = require("../app");
const createDataApp = require("../server");
const db = require("../db.json");

async function serve(t, app) {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  return (url, method = "GET", body) => fetch(base + url, {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

test("data is written to disk and survives a new app instance", async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ex6-test-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, "data.json");
  fs.writeFileSync(file, JSON.stringify({ message: "Hello, world!" }));
  const request = await serve(t, createDataApp(file));
  assert.deepEqual(await (await request("/data")).json(), { message: "Hello, world!" });
  const body = { message: "Updating with a new message!" };
  const response = await request("/update", "POST", body);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: "The data has been updated" });
  assert.deepEqual(JSON.parse(fs.readFileSync(file, "utf8")), body);
  const restarted = await serve(t, createDataApp(file));
  assert.deepEqual(await (await restarted("/data")).json(), body);
  assert.equal((await request("/update", "POST", [])).status, 400);
  assert.equal((await request("/update", "POST")).status, 400);
  fs.writeFileSync(file, "invalid json");
  assert.equal((await request("/data")).status, 500);
});

for (const name of ["articles", "videos"]) {
  test(`${name}: CRUD, validation, IDs, and collection routes`, async (t) => {
    const request = await serve(t, createApp());
    const url = `/${name}`;
    assert.deepEqual(await (await request(url)).json(), db[name]);
    assert.deepEqual(await (await request(`${url}/1`)).json(), db[name][0]);
    assert.equal((await request(`${url}/9999`)).status, 404);
    assert.equal((await request(`${url}/1abc`)).status, 400);
    assert.equal((await request(url, "POST", {})).status, 400);
    assert.equal((await request(url, "POST", [])).status, 400);
    const body = { title: "New item", date: "2024-03-10", text: "Example", id: 1 };
    if (name === "videos") body.video = "https://www.youtube.com/embed/hLluNp5xlJE";
    const created = await request(url, "POST", body);
    assert.equal(created.status, 201);
    const item = await created.json();
    assert.equal(item.id, 4);
    assert.equal(item.title, body.title);
    const updated = await request(`${url}/${item.id}`, "PUT", { title: "Updated", id: 999 });
    assert.equal(updated.status, 200);
    assert.deepEqual(await updated.json(), { ...body, title: "Updated", id: item.id });
    assert.equal((await request(`${url}/${item.id}`, "PUT", { title: " " })).status, 400);
    const deleted = await request(`${url}/${item.id}`, "DELETE");
    assert.equal(deleted.status, 204);
    assert.equal(await deleted.text(), "");
    assert.equal((await request(`${url}/${item.id}`)).status, 404);
    assert.equal((await request(`${url}/${item.id}`, "PUT", body)).status, 404);
    assert.equal((await request(`${url}/${item.id}`, "DELETE")).status, 404);
    const next = await (await request(url, "POST", body)).json();
    assert.ok(next.id > item.id);
    assert.equal((await request(url, "PUT", body)).status, 403);
    assert.equal((await request(`${url}/1`, "POST", body)).status, 403);
    assert.equal((await request(url, "DELETE")).status, 200);
    assert.deepEqual(await (await request(url)).json(), []);
    const other = name === "articles" ? "videos" : "articles";
    assert.deepEqual(await (await request(`/${other}`)).json(), db[other]);
  });
}

test("malformed JSON and unknown routes", async (t) => {
  const app = createApp();
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const bad = await fetch(`${base}/articles`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{",
  });
  assert.equal(bad.status, 400);
  assert.equal((await fetch(`${base}/missing`)).status, 404);
  const form = await fetch(`${base}/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "title=Form+article&text=Example",
  });
  assert.equal(form.status, 201);
  assert.equal((await form.json()).title, "Form article");
});
