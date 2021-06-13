const KoaRouter = require('koa-router');
const router = new KoaRouter({ prefix: '/api/v1' });

const { Books } = require('../../../../models');

const { pagination } = require('../../../../middleware/pagination');

const { getDefinedSubset, queryFormat } = require('../../../../util/helpers');

//get book
router.get('/books/:isbn', async ctx => {
  try{
    const book = await Books.findOne({ where: { isbn: ctx.params.isbn } });
    if (book === null) {
      ctx.status = 404;
      ctx.response.body = {error: {message: `No book in database with ISBN: ${ctx.params.isbn}` }};
      return;
    }

    ctx.status = 200;
    ctx.response.body = book;

  }catch(err){
    ctx.app.emit('error', err, ctx);
  }
});

//get books
router.get('/books', pagination(), async ctx => {
  try{
    const ALLOWED_QUERY_PARAMETERS = Object.keys(Books.rawAttributes);
    const query = queryFormat(getDefinedSubset(ALLOWED_QUERY_PARAMETERS, ctx.request.query));

    const books = await Books.findAndCountAll({
      where: query,
      order: ['title'],
      limit: ctx.state.limit,
      offset: ctx.state.offset,
    })

    ctx.response.body = {books: books};

  }catch(err){
    ctx.app.emit('error', err, ctx);
  }
});

//add book
router.post('/books', async ctx => {
  //get from ctx.request.body
  const BookToAdd = {
    title: "testTitle",
    isbn: "8",
    genre: "Fantasy",
    synopsis: "Is a pretty good book",
    pages: 420,
    seriesName: "Series name",
    authorName: "Michael Gibbons",
    authorBio: "Devilishly Handsome"
  }

  const [book, created] = await Books.findOrCreate({
    where: { isbn: BookToAdd.isbn },
    defaults: BookToAdd
  });

  if(created){
    ctx.status = 201;
    ctx.response.body = book;
    return;
  }
  ctx.throw(409, 'duplicate ISBN found.');
});
//replace a book's data PUT /books/:id
//update individual fields PATCH /books/:id
//delete book

module.exports = router