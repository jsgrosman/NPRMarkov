NPRMarkov
=========

A text generator seeded with NPR Content.

Settings
---------

Settings are stored in /lib/settings.js.
* apiKey: a valid NPR.org story API api key
* hostName: server host name
* port : server port

Modes
---------

* Command Line
    ``node main.js``

* Server
  Creates a server on the path /generate. 
    ``node server.js``

   Query String arguments
  * aggId : NPR.org id to see the text generation
  * markovOrder : 'OPTIONAL' Allows you to change how many words to use to generate the state machine. 
      A markov order of 1 uses one word. A markov order of 4 uses a collection of 4 words to link 
      to the next word.   
