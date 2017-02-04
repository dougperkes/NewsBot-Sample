const news = require('./news');

it('should return categories', () => {
  expect(news.categories.length).toBeGreaterThan(0);
});

it('should have the ny times key defined', () => {
  expect(process.env.NYTIMES_KEY).toBeTruthy();
});

it('should return article data', done => {
  news.article(news.categories[0])
    .then(data => {
      debugger;
      done();
    });
});
