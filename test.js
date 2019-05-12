//数据库的操作
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

//路由
const Koa = require('koa');
const nunjucks = require('nunjucks');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const app = new Koa();


app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

app.use(bodyParser());

app.use(controller());

app.listen(3000);