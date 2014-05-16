var api = require('./lib/api.js');
var markov = require('./lib/markov.js');

var titleMarkov = markov(1);
var storyTextMarkov = markov(2);

var API = api(1002);
API.query(0, function(apiObj) {
    

    var titles = API.getTitleList(apiObj);
    var allText = API.getStoryTextList(apiObj);
    updateMarkov(titleMarkov, storyTextMarkov, titles, allText);
    
    var newTitle = titleMarkov.generateSentence();
    var newStoryText = '';
    for (var i = 0; i < 5; i++) {
        var paragraph = "";
        for (var j = 0; j < 5; j++) {
            paragraph += storyTextMarkov.generateSentence() + ". ";
        }
        newStoryText += '<p>' + paragraph + '</p>\n';

    }

    console.log(newTitle);
    console.log(newStoryText);
       
});

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