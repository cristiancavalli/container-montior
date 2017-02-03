const crypto = require('crypto');
const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');

const app = koa();

app.use(logger());

app.use(route.get('/', function *() {
  this.body = '';
}));
app.use(route.get('/ping', function *() {
  this.body = 'pong';
}));
app.use(route.post('/hook', checkAuth));

function *checkAuth (next) {
  var payload = yield parse(this);
  if (!payload) {
    this.status = 400;
    return yield next;
  }
  console.log('here is the payload', process.env.SIGNATURE_KEY);
  const msg = payload.pull_request;
  const remoteSignature = this.request.headers['x-hub-signature'];
  const localSignature = crypto.createHmac('sha1', process.env.SIGNATURE_KEY)
    .update(JSON.stringify(payload)).digest('hex');
  const info = {
    repo: { 
      name: msg.head
    },
    head: {
      repo_name: msg.head.repo.name,
      ref: msg.head.ref,
      user: msg.head.user.login
    },
    url: [
      'git://github.com', msg.head.user.login, 
      msg.head.repo.name+'#'+msg.head.ref
    ].join('/')
  };
  console.log('SIGNATURES', 'remote:', remoteSignature, 'local:', localSignature);
  console.log('Here is info');
  console.log(o);
  this.body = 'ack';
}

app.listen(3000, function () {
  console.log('Server started @', (new Date).toLocaleString(), 
    -(new  Date).getTimezoneOffset()/60);
});
