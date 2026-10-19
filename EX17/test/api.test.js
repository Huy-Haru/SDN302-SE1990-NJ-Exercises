const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Article = require('../models/article');
const hasComments = require('node:fs').existsSync(require('node:path').join(__dirname, '../models/comment.js'));
let mongo, server, base;
before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  base = 'http://127.0.0.1:' + server.address().port;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
async function call(method, url, body, expected) {
  const response = await fetch(base + url, { method, ...(body === undefined ? {} : {headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)}) });
  assert.equal(response.status, expected, await response.clone().text());
  return response;
}
const valid = { title: '  Paris guide  ', text: 'Explore the hidden gardens of Paris.', tags: ['travel'] };
test('Article CRUD, validation, HTTP errors and population', async () => {
  assert.deepEqual(await (await call('GET', '/articles', undefined, 200)).json(), []);
  for (const bad of [{}, {...valid, title:'bad'}, {...valid, text:'too short'}, {...valid, tags:[]}, {...valid, date:'invalid'}]) {
    await call('POST', '/articles', bad, 400);
  }
  const payload = hasComments ? valid : {...valid, comments:[{body:'Great article!'}]};
  const article = await (await call('POST', '/articles', payload, 201)).json();
  const url = '/articles/' + article._id;
  assert.equal(article.title, 'Paris guide');
  assert.ok(!Number.isNaN(Date.parse(article.date)));
  if (!hasComments) { assert.equal(article.comments[0].body, 'Great article!'); assert.ok(article.comments[0].date); }
  assert.equal((await Article.findById(article._id)).text, valid.text);
  assert.equal((await (await call('GET', url, undefined, 200)).json())._id, article._id);
  assert.equal((await (await call('GET', '/articles', undefined, 200)).json()).length, 1);
  for (const bad of [{title:'bad'}, {text:'short'}, {tags:[]}]) await call('PUT', url, bad, 400);
  const updated = await (await call('PUT', url, {title:'Updated Paris guide'}, 200)).json();
  assert.equal(updated.title, 'Updated Paris guide');
  assert.equal(updated.text, valid.text);
  await call('PUT', '/articles', {}, 403);
  await call('POST', url, {}, 403);
  for (const method of ['GET','PUT','DELETE']) {
    await call(method, '/articles/invalid-id', method === 'PUT' ? {title:'Valid title'} : undefined, 400);
    await call(method, '/articles/000000000000000000000000', method === 'PUT' ? {title:'Valid title'} : undefined, 404);
  }
  assert.equal((await fetch(base+'/articles',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})).status,400);
  await call('GET','/unknown',undefined,404);
  if (hasComments) {
    await call('POST','/comments',{},400);
    await call('POST','/comments',{body:'Hello',article:'bad'},400);
    const comment = await (await call('POST','/comments',{body:'Great guide!',article:article._id},201)).json();
    assert.equal(comment.article,article._id);
    const Comment = require('../models/comment');
    const saved = await Comment.findById(comment._id);
    assert.ok(saved.article instanceof mongoose.Types.ObjectId);
    const comments = await (await call('GET','/comments',undefined,200)).json();
    assert.equal(comments[0].article._id,article._id);
    assert.equal(comments[0].article.title,'Updated Paris guide');
  }
  assert.equal(await (await call('DELETE',url,undefined,204)).text(),'');
  await call('GET',url,undefined,404);
  await call('DELETE',url,undefined,404);
  if (hasComments) assert.equal((await (await call('GET','/comments',undefined,200)).json())[0].article,null);
  await call('POST','/articles',valid,201);
  await call('POST','/articles',valid,201);
  assert.equal(await (await call('DELETE','/articles',undefined,200)).text(),'All articles deleted successfully.');
  assert.equal(await Article.countDocuments(),0);
});