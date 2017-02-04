require('dotenv').config();
const fetch = require('node-fetch');

module.exports.categories = [
  'home',
  'opinion',
  'world',
  'national',
  'politics',
  'upshot',
  'nyregion',
  'business',
  'technology',
  'science',
  'health',
  'sports',
  'arts',
  'books',
  'movies',
  'theater',
  'sundayreview',
  'fashion',
  'tmagazine',
  'food',
  'travel',
  'magazine',
  'realestate',
  'automobiles',
  'obituaries',
  'insider'
];

module.exports.article = category => {
  return fetch(`http://api.nytimes.com/svc/topstories/v1/${category}.json?api-key=${process.env.NYTIMES_KEY}`)
    .then(res => res.json());
};
