var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

var newsCats = ["World", "National", "Sports", "Food"]
var news = [
    {
        "title": "Borders Reopen to Banned Visa Holders; Trump Attacks Judge",
        "abstract": "In announcing its intent to appeal a Seattle judge’s temporary restraining order, the White House used fairly muted language. Not so the president.",
        "url": "https://www.nytimes.com/2017/02/04/us/politics/black-site-prisons-cia-terrorist.html",
        "multimedia": [
            {
                "url": "https://static01.nyt.com/images/2017/02/05/us/05ban-web/05ban-web-thumbStandard.jpg",
                "format": "Standard Thumbnail",
                "height": 75,
                "width": 75,
                "type": "image",
                "subtype": "photo",
                "caption": "President Trump leaving the White House on Friday to travel to his Mar-a-Lago resort in Palm Beach, Fla.",
                "copyright": "Al Drago/The New York Times"
            },
        ]
    },
    {
        "title": "Trust Records Show Trump Is Still Closely Tied to His Empire",
        "abstract": "New documents on the president’s trust, set up to allay fears of conflicts of interest, show just how closely tied he remains to his business.",
        "url": "https://www.nytimes.com/2017/02/04/us/politics/black-site-prisons-cia-terrorist.html",
        "multimedia": [
            {
                "url": "https://static01.nyt.com/images/2017/02/04/us/00trumptrust-1/00trumptrust-1-thumbStandard.jpg",
                "format": "Standard Thumbnail",
                "height": 75,
                "width": 75,
                "type": "image",
                "subtype": "photo",
                "caption": "Among the Trump family, Donald Trump Jr., right, is one of two named trustees who have broad legal authority over President Trump’s assets. The elder Mr. Trump can revoke the trustees’ authority at any time.",
                "copyright": "Shannon Stapleton/Reuters"
            },
        ]
    },
    {
        "title": "In Fall of Gorsuch’s Mother, a Painful Lesson in Politicking",
        "abstract": "President Trump’s Supreme Court nominee learned from an early age about how caustic the nation’s political culture could be. He now faces his own test in Washington.",
        "url": "https://www.nytimes.com/2017/02/04/us/politics/black-site-prisons-cia-terrorist.html",
        "multimedia": [
            {
                "url": "https://static01.nyt.com/images/2017/02/05/us/05gorsuch-jp1/05gorsuch-jp1-thumbStandard-v2.jpg",
                "format": "Standard Thumbnail",
                "height": 75,
                "width": 75,
                "type": "image",
                "subtype": "photo",
                "caption": "Judge Neil M. Gorsuch in Washington on Wednesday. He learned from his mother’s experience “what the realpolitik of Washington could be like.”",
                "copyright": "Al Drago/The New York Times"
            },
        ]
    },
    {
        "title": "In His Own Words: Gorsuch’s Lively Writings at Columbia",
        "abstract": "Neil Gorsuch’s topics ranged broadly, from life on campus to the Iran-contra affair. His conservatism was a constant. And his vibrant writing style persists to this day.",
        "url": "https://www.nytimes.com/2017/02/04/us/politics/black-site-prisons-cia-terrorist.html",
        "multimedia": [
            {
                "url": "https://static01.nyt.com/images/2017/02/05/us/05gorsuchside/05gorsuchside-thumbStandard.jpg",
                "format": "Standard Thumbnail",
                "height": 75,
                "width": 75,
                "type": "image",
                "subtype": "photo",
                "caption": "Judge Neil M. Gorsuch spoke in the East Room of the White House after President Trump introduced him as his Supreme Court nominee on Tuesday.",
                "copyright": "Al Drago/The New York Times"
            },
        ]
    },
    {
        "title": "White House Pulls Back From Bid to Reopen C.I.A. ‘Black Site’ Prisons",
        "abstract": "A draft order deletes language contemplating a revival of overseas prisons where terrorism suspects were once tortured.",
        "url": "https://www.nytimes.com/2017/02/04/us/politics/black-site-prisons-cia-terrorist.html",
        "multimedia": [
            {
                "url": "https://static01.nyt.com/images/2017/02/05/us/05detainees/05detainees-thumbStandard.jpg",
                "format": "Standard Thumbnail",
                "height": 75,
                "width": 75,
                "type": "image",
                "subtype": "photo",
                "caption": "A guard post at the Guant&aacute;namo Bay prison in Cuba. Sections of a draft order include a call to bring newly captured terrorism detainees there.",
                "copyright": "Paul J. Richards/Agence France-Presse &mdash; Getty Images"
            },
        ]
    },
]

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
            var articles = news.map(function (newsItem) {
                return new builder.HeroCard(session)
                    .title(newsItem.title)
                    .text(newsItem.abstract)
                    .images([
                        builder.CardImage.create(session, newsItem.multimedia[0].url)
                    ])
                    .tap(builder.CardAction.openUrl(session, newsItem.url))
            });

            session.send("You selected " + cat);

            var msg = new builder.Message(session)
                .attachments(articles);
            session.send(msg);
            
            // session.send("We sold %(units)d units for a total of %(total)s.", region); 
        } else {
            session.send("ok");
        }
    }
]
);