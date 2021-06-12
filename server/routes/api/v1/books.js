const KoaRouter = require('koa-router');
const router = new KoaRouter({ prefix: '/api/v1' });

const { Books } = require('../../../../models');

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
router.get('/books', async ctx => {
  try{
    const MAX_LIMIT = 100;
    const DEFAULT_LIMIT = 20;

    let page = ctx.request.query.page;
    let limit = ctx.request.query.limit;

    if(limit > MAX_LIMIT){
      ctx.status = 400;
      ctx.response.body = {error: {message: `A maximum of ${MAX_LIMIT} records per request is allowed.` }};
      return;
    }

    if(!page || page < 0 || isNaN(page)){
      page = 1;
    }

    if(!limit || isNaN(limit)){
      limit = DEFAULT_LIMIT;
    }

    const offset = (page == 1) ? 0 : limit*(page - 1);

    let query = (({ title, isbn, genre, synopsis, numberOfPages, seriesName, authorName, authorBio }) => ({ title, isbn, genre, synopsis, numberOfPages, seriesName, authorName, authorBio }))(ctx.request.query);
    Object.keys(query).forEach(key => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    const books = await Books.findAndCountAll({
      where: query,
      order: ['title'],
      limit: limit,
      offset: offset,
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
    isbn: "5",
    genre: "Fantasy",
    synopsis: "Is a pretty good book",
    numberOfPages: "420",
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