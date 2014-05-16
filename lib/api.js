var http = require('http');
var settings = require('./settings.js');

module.exports = function(queryId) {
    var options = {
      host: 'api.npr.org',
      path: '/query?fields=summary,text&format=json&numResults=50&apiKey=' + settings.apiKey + '&id=' + queryId
    };

    var parseResults = function(response, callback) {
        var output = '';
        response.on('data', function (chunk) {
            output += chunk;
        });
        
        response.on('end', function() {
            var obj = JSON.parse(output);
            callback(obj);
        });
        
        
    };
    
    
    
    return {
      query : function(startNum, callback) {
          var newOptions = options;
          newOptions.path = newOptions.path + '&startNum=' + startNum;
          
          http.request(newOptions, function(response) {
              parseResults(response, callback);
          }).end();
      },
      getTitleList : function(apiObj) {
          var titles = [];
          if ('story' in apiObj.list) {
              titles = apiObj.list.story.map(function (elm) {
                  return elm.title.$text; 
              });
          }
          return titles;
      },
      getStoryTextList : function(apiObj) {
          var allText = [];
          if ('story' in apiObj.list) {
              apiObj.list.story.forEach(function(elm) {
                  if ('text' in elm && 'paragraph' in elm.text) {
                      elm.text.paragraph.forEach(function(para) {
                          if ('$text' in para && para.$text.indexOf('[Copyright') === - 1) {
                              allText.push(para.$text);
                          }
                      });
                  }
              });
          }
          return allText;
      },
      getAggName : function(apiObj) {
          return apiObj.list.title.$text;
      }
      
    };
};