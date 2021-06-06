const Koa = require('koa');
const KoaRouter = require('koa-router');
const cors = require('@koa/cors');
const dbRoutes = require('./routes/api/v1/db');

const app = new Koa();
const router = new KoaRouter();

const db = require("../models");


app
  .use(dbRoutes.routes())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(cors({credentials: true, origin: true}));


router.get('/', ctx => ctx.body ='Hello world');

const port = process.env.PORT || 3000
db.sequelize.sync().then(async (req) => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  });
})