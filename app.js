const restify = require('restify');
const builder = require('botbuilder');
const news = require('./news');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var newsCats = news.categories;

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        builder.Prompts.choice(session, "Which category?", newsCats, { listStyle: builder.ListStyle.button });
    },
    function (session, results, next) {
        if (results.response) {
            // var region = salesData[results.response.entity];
            var cat = results.response.entity;
            session.send("You selected " + cat + ". Retrieving articles...");

            news.article(cat).then(function (data) {
                // add error handling
                console.log(JSON.stringify(data));
                var newsArticles = data.results;

                var articles = newsArticles.slice(0, 5).map(function (newsItem) {
                    var item = new builder.HeroCard(session)
                        .title(newsItem.title)
                        .text(newsItem.abstract)
                        .tap(builder.CardAction.openUrl(session, newsItem.url));
                    if (newsItem.multimedia && newsItem.multimedia.length > 0) {
                        item.images([
                            builder.CardImage.create(session, newsItem.multimedia[0].url)
                        ]);
                    }
                    return item;
                });


                var msg = new builder.Message(session)
                    .attachments(articles);
                session.send(msg);
            })

            // session.send("We sold %(units)d units for a total of %(total)s.", region); 
        } else {
            session.send("ok");
        }
    }
]
);