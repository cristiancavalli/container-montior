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

function *checkAuth () {
  var payload = yield parse(this);
  console.log('here is the payload', payload);
  this.body = 'ack';
}

app.listen(3000, function () {
  console.log('Server started @', (new Date).toLocaleString(), 
    -(new  Date).getTimezoneOffset()/60);
});
