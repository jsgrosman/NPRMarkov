var S = require('../node_modules/string');

module.exports = function(markovOrder) {
    
    /**
     * core data structure for holding all of the word links
     */
    var markovChain = {};
    
    /**
     * Selects a random element from the array
     */
    var chooseFromArray = function(myArray) {
        if (myArray) {
            return myArray[Math.floor(Math.random() * myArray.length)];
        }
        else {
            return null;
        }
    };

    /**
     * Quick and dirty replacement of punctuation
     */
    var myStripPunctuation = function(s) {
        return s.replace(/["\.\/#!$%\^&\*;:{}=\_~()]/g,"");
    };

    /**
     * get a string of N words from the array
     */
    var getNWords = function(wordArray, startAt, n) {
        var retWord = '';
        
        for (var i = 0; i < n; i++) {
            if ((startAt + i) < wordArray.length) {
                retWord += wordArray[startAt + i] + ' ';
            }
        }
        
        return S(retWord).trim().s;
    };
    
    return {
        /**
         * Add a complete sentence to the data structure
         */
        add : function(words) {
            
            if (typeof words === 'undefined') {
                return;
            }
            
            var wordsArray = S(words).decodeHTMLEntities().stripTags().s.trim().split(/\s+/);
            
            wordsArray = wordsArray.map(function(value) {
                return myStripPunctuation(value);
            });

            for (var index = 0; index < wordsArray.length - 1; index++) {
                var wordToUse = getNWords(wordsArray, index, markovOrder);
                
                // add to the _start element if it is the start of the text, or if the previous word ended with punctuation
                if (index === 0) {
                    
                    if ('_start' in markovChain) {
                        var wordChainArray = markovChain['_start'];
                        wordChainArray.push(wordToUse);
                    }
                    else {
                        markovChain['_start'] = [wordToUse];
                    }
                    
                    if (markovOrder < wordsArray.length) {
                        
                        var nextWord = wordsArray[markovOrder];
                        
                        if (wordToUse in markovChain) {
                            var wordChainArray = markovChain[wordToUse];
                            wordChainArray.push(nextWord);
                        }
                        else {
                            markovChain[wordToUse] = [nextWord];
                        }
                    }
                    
                }
                // add to the _end element if it is the end of the text, or if the word ended with punctuation
                else if (index === wordsArray.length - 1) {
                    if ('_end' in markovChain) {
                        var wordChainArray = markovChain['_end'];
                        wordChainArray.push(wordToUse);
                    }
                    else {
                        markovChain['_end'] = [wordToUse];
                    }
                }
                else {
                    if ((index + markovOrder) < wordsArray.length) {
                        
                        var nextWord = wordsArray[index + markovOrder];
                        
                        if (wordToUse in markovChain) {
                            var wordChainArray = markovChain[wordToUse];
                            wordChainArray.push(nextWord);
                        }
                        else {
                            markovChain[wordToUse] = [nextWord];
                        }
                    }
                }
            }
        },
        /**
         * Create a single sentence using the markov chain
         */
        generateSentence : function() {
            
            var startWords = markovChain['_start'];
            var nextWord = chooseFromArray(startWords);
            var randomSentenceArray = nextWord.split(/\s+/);
            
            while (true) {
                // get last N words
                var wordKey = randomSentenceArray.slice(-markovOrder).join(' ');
                if (wordKey in markovChain) {
                    var nextWordList = markovChain[wordKey];
                    nextWord = chooseFromArray(nextWordList);
                    randomSentenceArray.push(nextWord);
                    
                }
                else {
                    break;
                }
            }
            return randomSentenceArray.join(' ');
        },
        /**
         * Print out the data structure to the console
         */
        debugChain : function() {
            console.log(markovChain);
        }
        
    };
};


