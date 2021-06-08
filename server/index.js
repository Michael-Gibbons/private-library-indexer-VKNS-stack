const fs = require('fs');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const serve  = require('koa-static');
const cors = require('@koa/cors');
const booksRoutes = require('./routes/api/v1/books');

const app = new Koa();
const router = new KoaRouter();

const db = require("../models");

app.use(serve('./dist/'));

app
  .use(async (ctx, next) => {
    if(!ctx.request.path.includes('/api/')){
      ctx.type = 'html';
      ctx.body = fs.readFileSync('./dist/index.html');
    }
    await next();
  })
  .use(booksRoutes.routes())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(cors({credentials: true, origin: true}));


const port = process.env.PORT || 3000
db.sequelize.sync().then(async (req) => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  });
})