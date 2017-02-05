require('dotenv').config();
const fetch = require('node-fetch');

module.exports.categories = [
  'home',
  'opinion',
  'world',
  'national',
  'politics',
  'business',
  'technology',
  'science',
  'health',
  'sports',
  'arts',
  'fashion',
  'travel',
];

module.exports.article = category => {
  return fetch(`http://api.nytimes.com/svc/topstories/v1/${category}.json?api-key=${process.env.NYTIMES_KEY}`)
    .then(res => res.json());
};
