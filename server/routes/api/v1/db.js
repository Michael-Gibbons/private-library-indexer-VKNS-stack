const KoaRouter = require('koa-router');
const router = new KoaRouter();

const { Books } = require('../../../../models');

const BASE_URL = '/api/v1/db';
//get records
router.get(BASE_URL, ctx => ctx.body ='Hello from the db route');
//add record
router.get(BASE_URL + '/create', ctx => {
  Books.create({
    title: "testTitle",
    isbn: "3",
    genre: "Fantasy",
    synopsis: "Is a pretty good book",
    numberOfPages: "420",
    seriesName: "Series name",
    authorName: "Michael Gibbons",
    authorBio: "Devilishly Handsome"
  });


});
//delete record

module.exports = router