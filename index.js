const crypto = require('crypto');
const logger = require('koa-logger');
const route = require('koa-route');
const parse = require('co-body');
const koa = require('koa');
const createCluster = require('./createCluster');
const deployImage = require('./deployImage');
const exposeDeployment = require('./exposeDeployment');

function beginDeploy (upstream, prUrl) {
  createCluster({request: {upstream: upstream, prUrl: prUrl}})
    .then(deployImage)
    .then(exposeDeployment)
    .then((res) => console.log('Completed!\n', res))
    .catch((e) => console.error(e));
}

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
  console.log(info);
  this.body = 'ack';
  setImmediate(beginDeploy.bind(null, info.url, msg.url));
}

app.listen(80, function () {
  console.log('Server started @', (new Date).toLocaleString(), 
    -(new  Date).getTimezoneOffset()/60);
});
