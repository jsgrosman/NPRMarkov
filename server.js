var http = require('http');
var url = require("url");
var fs = require('fs');

var S = require('./node_modules/string');
var api = require('./lib/api.js');
var markov = require('./lib/markov.js');
var settings = require('./lib/settings.js');

var nprTemplate = '';
fs.readFile('./templates/nprStory.template', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    nprTemplate = data;
});

http.createServer(function (req, res) {

    var parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname == '/generate') {

        var aggId = parsedUrl.query.aggId;
        var markovOrder = 2;
        if ('markovOrder' in parsedUrl.query) {
            markovOrder = parseInt(parsedUrl.query.markovOrder);
        }  

        createStory(aggId, markovOrder, function(title, storyText, aggName) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            var htmlPage = S(nprTemplate).template({storyTitle: title, storyText : storyText, aggName : aggName}).s;

            res.end(htmlPage);
        });


    }

}).listen(settings.port, settings.hostName);
console.log('Server running');

var createStory = function(aggId, markovOrder, callback) {
    
    var titleMarkov = markov(1);
    var storyTextMarkov = markov(markovOrder);
    
    var API = api(aggId);
    API.query(0, function(apiObj) {

        var titles = API.getTitleList(apiObj);
        var allText = API.getStoryTextList(apiObj);
        
        
        updateMarkov(titleMarkov, storyTextMarkov, titles, allText);
        
        API.query(50, function(apiObj1) {
            var aggName = API.getAggName(apiObj1);
            
            var titles1 = API.getTitleList(apiObj1);
            var allText1 = API.getStoryTextList(apiObj1);
            
            updateMarkov(titleMarkov, storyTextMarkov, titles1, allText1);
            var newTitle = titleMarkov.generateSentence();
            var newStoryText = '';
            for (var i = 0; i < 5; i++) {
                var paragraph = "";
                for (var j = 0; j < 5; j++) {
                    paragraph += storyTextMarkov.generateSentence() + ". ";
                }
                newStoryText += '<p>' + paragraph + '</p>\n';

            }

            callback(newTitle, newStoryText, aggName);
        });
        
    });

};

var updateMarkov = function(titleMarkov, storyTextMarkov, titles, allText) {
    titles.forEach(function(data) {
        titleMarkov.add(data);
    });

    allText.forEach(function(data) {

        var sentences = data.split(/[\.\?!]\s/);
        for (var i = 0; i < sentences.length; i++) {
            storyTextMarkov.add(sentences[i]);
        }  
    });

};

//console.log(aggId);