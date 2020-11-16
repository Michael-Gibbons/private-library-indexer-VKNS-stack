const KoaRouter = require('koa-router');
const router = new KoaRouter();

const BASE_URL = '/api/v1/records';
//get records
router.get(BASE_URL, ctx => ctx.body ='Hello from the api route');
//add record

//delete record

module.exports = router