const Koa = require('koa');
const KoaRouter = require('koa-router');
const cors = require('cors');
const recordRoutes = require('./routes/api/v1/records');

const app = new Koa();
const router = new KoaRouter();
app
  .use(recordRoutes.routes())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(cors());


router.get('/', ctx => ctx.body ='Hello world');

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
});