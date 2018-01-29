/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
// or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.

// TODO add URL to this entry in the cookbook


 // 1. Text strings =====================================================================================================
 //    Modify these strings and messages to change the behavior of your Lambda function

 let speechOutput;
 let reprompt;
 const welcomeOutput = "I can guess the fruit you're thinking about, let me know when you're ready!"
 const welcomeReprompt = "Let me know if you have a fruit in mind!";
 const fruitAnswerIntro = [
   "hmm... let me guess, your fruit is...",
   "Ok, I think i've got it... your fruit is... ",
   "Oh, I like this fruit, it must be... "
 ];



 // 2. Skill Code =======================================================================================================

'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.879f09e1-2b86-4ab9-aa7f-abbb6f9eaabb";

const handlers = {
    'LaunchRequest': function () {
      this.response.speak(welcomeOutput).listen(welcomeReprompt);
      this.emit(':responseReady');
    },
    'AlexaGuessFruit': function () {
       //compose speechOutput that simply reads all the collected slot values
        var answerOutput = randomPhrase(fruitAnswerIntro);
        var defaultAnswer = "Sorry, this is a fruit I don't know about yet!";

        var itemAnswer = guessItem(this);

        if (itemAnswer == "unknown") {
            answerOutput = defaultAnswer;
        }
        else if (itemAnswer == "multiple") {
            answerOutput = "Sorry, Dorothy isn't advanced enough to process this.";
        }
        else {
            answerOutput += itemAnswer;
            answerOutput += ". " + randomPhrase(getFruitFact(itemAnswer));
        }
        
        this.response.speak(answerOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = "";
        reprompt = "";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}

function getAttribute(obj, slot, test) {
    // the argument is an applicable Intent 'slot' in the form of the string
    var intentObj = obj.event.request.intent;
    const yesArray =[
         "yea",
         "yeah",
         "yep",
         "mhm",
         "absolutely",
         "of course",
         "indeed",
         "I think so",
         "probably",
         "certainly",
         "true"
    ];
    const noArray =[
         "nah",
         "nope",
         "probably not",
         "no way",
         "absolutely not",
         "of course not",
         "naw",
         "false"
    ];
    
    var string;
    
    for(var i in test) {
        string += test[i].name;
    }
    
    if (!intentObj.slots[slot].value) {
        const slotToElicit = slot;
        const speechOutput = getAttributePrompt(slot);
        const repromptSpeech = speechOutput;
        obj.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
    }

    if (yesArray.indexOf(obj.event.request.intent.slots[slot].value) != -1) {
        return "yes";
    }
    else if (noArray.indexOf(obj.event.request.intent.slots[slot].value) != -1) {
        return "no";
    }
    else if (obj.event.request.intent.slots[slot].value == "none"){
        return '0'
    }
    else if (obj.event.request.intent.slots[slot].value == "many"){
        return 'multiple'
    }

   return obj.event.request.intent.slots[slot].value;
}

function guessItem(object) {
  var gameData = JSON.parse(JSON.stringify(fruitData));

  while(gameData.items.length > 1 && gameData.attributes.length > 0) {
    var attributeTagMax = "";
    var attributeCntMax = 0;
    var op = "=";
    var index = 0;

    for(var a in gameData.attributes) {
      var attribute = gameData.attributes[a];
      var valueSet = new Set();

      for(var i in gameData.items) {
        var item = gameData.items[i];
        if(item[attribute] instanceof Array) {
          valueSet.add(item[attribute][0]);
        } else {
          valueSet.add(item[attribute]);
        }
      }

      if(valueSet.size > attributeCntMax) {
        attributeCntMax = valueSet.size;
        attributeTagMax = attribute;
        op = (gameData.items[0][attribute] instanceof Array) ? "~" : "=";
        index = a;
      }
    }

    var response = getAttribute(object, attributeTagMax, gameData.items);
    var items = jsonQuery(`items[*${attributeTagMax}${op}${response}]`, {data : gameData}).value;
    
    gameData.items = items;
    gameData.attributes.splice(index, 1);
  }

  switch(gameData.items.length) {
    case 0: return "unknown";
    case 1: return gameData.items[0].name;
    default: return "multiple";
  }
}

var jsonQuery = require("json-query");
var readlineSync = require("readline-sync");
var _ = require("underscore");

function getAttributePrompt(slot)
{
  switch(slot){
   case "sizeTennisBall": return "Is your fruit smaller than, larger than, or around the same size as a tennis ball? For example, an apple is roughly the same size as a tennis ball!";
   case "colourInside": return "What colour is your fruit on the inside?";
   case "colourOutside": return "What colour is your fruit on the outside?";
   case "numberSeeds": return "Does your fruit have one pit, multiple seeds, or none?";
   case "isLong": return "Is the shape of your fruit long?";
   case "isStinky": return "Is your fruit stinky?";
   case "isSkinRough": return "Is the skin of your fruit rough?";
   case "isCitrus": return "Is your fruit a citrus fruit?";
   case "isBellShape": return "Is your fruit bell-shaped?";
   case "isEdibleSkin": return "Do you typically eat the skin of your fruit?";
   case "isBerry": return "Is your fruit a berry?";
   case "isOneBiteSize": return "Can you eat your fruit in one bite?";
   case "seedsOutside": return "Does your fruit have visible seeds on the outside?";
  }
}

const fruitData = {
  "items" : [
    {
      "name": "mango",
      "sizeTennisBall": "larger",
      "colourInside": ["yellow", "orange"],
      "numberSeeds": "1",
      "colourOutside": ["yellow", "orange", "red", "green"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "pineapple",
      "sizeTennisBall": "larger",
      "colourInside": ["yellow"],
      "numberSeeds": "multiple",
      "colourOutside": ["yellow", "brown"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "yes",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "pomegranate",
      "sizeTennisBall": "larger",
      "colourInside": ["red"],
      "numberSeeds": "multiple",
      "colourOutside": ["red"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "yes",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "durian",
      "sizeTennisBall": "larger",
      "colourInside": ["yellow"],
      "numberSeeds": "multiple",
      "colourOutside": ["brown", "yellow", "green"],
      "isLong": "no",
      "isStinky": "yes",
      "isSkinRough": "yes",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "banana",
      "sizeTennisBall": "larger",
      "colourInside": ["yellow", "white"],
      "numberSeeds": "0",
      "colourOutside": ["yellow"],
      "isLong": "yes",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "coconut",
      "sizeTennisBall": "larger",
      "colourInside": ["white"],
      "numberSeeds": "0",
      "colourOutside": ["brown", "green"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "yes",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "watermelon",
      "sizeTennisBall": "larger",
      "colourInside": ["red"],
      "numberSeeds": "multiple",
      "colourOutside": ["green"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "papaya",
      "sizeTennisBall": "larger",
      "colourInside": ["orange", "yellow"],
      "numberSeeds": "multiple",
      "colourOutside": ["green", "yellow"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "yes",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "cantaloupe",
      "sizeTennisBall": "larger",
      "colourInside": ["orange", "yellow"],
      "numberSeeds": "multiple",
      "colourOutside": ["green", "yellow", "brown"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "yes",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "honeydew",
      "sizeTennisBall": "larger",
      "colourInside": ["green"],
      "numberSeeds": "multiple",
      "colourOutside": ["green", "yellow", "brown"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "yes",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "grapefruit",
      "sizeTennisBall": "larger",
      "colourInside": ["red", "pink"],
      "numberSeeds": "multiple",
      "colourOutside": ["orange"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "yes",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "orange",
      "sizeTennisBall": "same",
      "colourInside": ["orange"],
      "numberSeeds": "multiple",
      "colourOutside": ["orange"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "yes",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "lemon",
      "sizeTennisBall": "same",
      "colourInside": ["yellow"],
      "numberSeeds": "multiple",
      "colourOutside": ["yellow"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "yes",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "lime",
      "sizeTennisBall": "same",
      "colourInside": ["green"],
      "numberSeeds": "multiple",
      "colourOutside": ["green"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "yes",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "apple",
      "sizeTennisBall": "same",
      "colourInside": ["yellow", "white"],
      "numberSeeds": "multiple",
      "colourOutside": ["green", "red"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "pear",
      "sizeTennisBall": "same",
      "colourInside": ["yellow", "white"],
      "numberSeeds": "multiple",
      "colourOutside": ["green"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "yes",
      "isEdibleSkin": "yes",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "peach",
      "sizeTennisBall": "same",
      "colourInside": ["yellow", "orange"],
      "numberSeeds": "1",
      "colourOutside": ["yellow", "orange", "red"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "cherry",
      "sizeTennisBall": "smaller",
      "colourInside": ["yellow", "red"],
      "numberSeeds": "1",
      "colourOutside": ["yellow", "red"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "no",
      "isOneBiteSize": "yes",
      "seedsOutside": "no"
    },
    {
      "name": "strawberry",
      "sizeTennisBall": "smaller",
      "colourInside": ["red", "pink", "white"],
      "numberSeeds": "multiple",
      "colourOutside": ["red"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "yes",
      "isOneBiteSize": "yes",
      "seedsOutside": "yes"
    },
    {
      "name": "blackberry",
      "sizeTennisBall": "smaller",
      "colourInside": ["white", "black"],
      "numberSeeds": "multiple",
      "colourOutside": ["black"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "yes",
      "isOneBiteSize": "yes",
      "seedsOutside": "no"
    },
    {
      "name": "blueberry",
      "sizeTennisBall": "smaller",
      "colourInside": ["white", "green", "blue"],
      "numberSeeds": "multiple",
      "colourOutside": ["blue"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "yes",
      "isOneBiteSize": "yes",
      "seedsOutside": "no"
    },
    {
      "name": "raspberry",
      "sizeTennisBall": "smaller",
      "colourInside": ["red", "pink"],
      "numberSeeds": "multiple",
      "colourOutside": ["red", "pink"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "yes",
      "isOneBiteSize": "yes",
      "seedsOutside": "no"
    },
    {
      "name": "apricot",
      "sizeTennisBall": "smaller",
      "colourInside": ["orange", "yellow"],
      "numberSeeds": "1",
      "colourOutside": ["orange", "red"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "plum",
      "sizeTennisBall": "smaller",
      "colourInside": ["orange", "yellow"],
      "numberSeeds": "1",
      "colourOutside": ["red", "purple"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "grape",
      "sizeTennisBall": "smaller",
      "colourInside": ["red", "purple", "green", "white", "clear"],
      "numberSeeds": "multiple",
      "colourOutside": ["red", "purple", "green"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "yes",
      "isBerry": "no",
      "isOneBiteSize": "yes",
      "seedsOutside": "no"
    },
    {
      "name": "kiwi",
      "sizeTennisBall": "smaller",
      "colourInside": ["green", "white"],
      "numberSeeds": "multiple",
      "colourOutside": ["brown"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    },
    {
      "name": "lychee",
      "sizeTennisBall": "smaller",
      "colourInside": ["white"],
      "numberSeeds": "1",
      "colourOutside": ["red", "pink", "brown"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "no",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "yes",
      "seedsOutside": "no"
    },
    {
      "name": "dragonfruit",
      "sizeTennisBall": "larger",
      "colourInside": ["white", "pink", "purple"],
      "numberSeeds": "many",
      "colourOutside": ["pink", "purple", "red"],
      "isLong": "no",
      "isStinky": "no",
      "isSkinRough": "yes",
      "isCitrus": "no",
      "isBellShape": "no",
      "isEdibleSkin": "no",
      "isBerry": "no",
      "isOneBiteSize": "no",
      "seedsOutside": "no"
    }
  ],
  "attributes" : ["sizeTennisBall", "colourInside", "colourOutside", "numberSeeds", "isLong", "isStinky", "isSkinRough", "isCitrus", "isBellShape", "isEdibleSkin", "isBerry", "isOneBiteSize", "seedsOutside"]
};

function getFruitFact(fruit) {
	switch (fruit) {
		case "apple":
			return ["Did you know that apples are part of the rose family? Cool, right?",
				"Here is a fun fact about apple trees: they take four to five years to produce their first fruit.",
				"Here is an interesting fact: It takes the energy from 50 leaves to produce one apple.That’s a lot of energy!"];
		case "orange":
			return ["Did you know that Oranges contain more fiber than most fruits and vegetables? That’s very healthy!",
				"Here is a fun fact: the word “Orange” was first used to describe the colour and not the fruit.",
				"Here is an interesting fact: there are now over 600 varieties of oranges worldwide!"];
		case "strawberry":
			return ["Did you know there are there are 200 seeds on an average strawberry? Interesting, right?",
				"Here is a fun fact about strawberries: they are members of the rose family!",
				"Here is an interesting fact: There is a museum in Belgium just for strawberries. Sounds like fun!"];
		case "blackberry":
			return ["Did you know blackberries contain a lot of antioxidants which protect against inflammation, neurological diseases and aging? Interesting!",
				"Here is a fun fact about blackberries: they contain a lot of vitamins such as vitamin C, vitamin A, vitamin E, and vitamin K",
				"Here is an interesting fact: Blackberries are also known as thimbleberries, dewberries, and brambleberries."];
		case "blueberry":
			return ["Did you know that there are two types of blueberries: highbush and lowbush? I didn’t!",
				"Here is a fun fact: it only takes 4 minutes to freeze in the freezer!",
				"Here is an interesting fact: the white, powdery substance on blueberries is called “bloom.” Bloom indicates fresh berries"];
		case "banana":
			return ["Did you know that bananas are technically berries? Weird!",
				"Here is a fun fact: bananas float on water! I have to try this out!",
				"Interesting fact: about 75 percent of the weight of a banana is water."];
		case "mango":
			return ["Did you know you can ripen mangoes faster by placing them in a paper bag at room temperature? I sure didn’t!",
				"Here is a fun fact: mango trees can grow to be around 30 meters. That is the length of over two school buses! ",
				"Interesting fact: Mango are actually related to cashews and pistachios."]
		case "pineapple":
			return ["Did you know that it takes almost 3 years for one pineapple to fully ripen? Cool, right?",
				"Here is a fun fact: once a pineapple is harvested, they do not continue to ripen!",
				" By the way, has your tongue ever hurt after eating a pineapple? This is because of an enzyme called bromelain that attacks your tongue, cheeks, and lips on contact. But don’t worry, your saliva and stomach acids can easily fight back and win the fight once you swallow or chew the pineapple."]
		case "pomegranate":
			return ["Did you know that pomegranates actually belong to the berry family? Interesting!",
				"Here is a fun fact: pomegranates grow from trees! And these trees can live for over 150 years.",
				"Interesting fact: Pomegranates are extremely healthy. They contain a lot of vitamins C and K which improves your immune system and reduces blood clotting."]
		case "durian":
			return ["Did you know Durians contain a lot of vitamin B complex, potassium and calcium which helps to maintain healthy teeth and bones?",
				"Here is a fun fact: when a durian becomes ripe, it falls off from the tree automatically!",
				"Interesting fact: If you are feeling down, eat a Durian! Its richness in carbohydrates will give you a boost of energy quickly!"]
		case "coconut":
			return ["Did you know that in the early stages of a coconuts growth, it contains high levels of water which can be consumed directly as a refreshing drink? Sounds yummy!",
				"Here is a fun fact: the white, fleshy part of the coconut seed is called coconut meat. It has high amounts of manganese, potassium, and copper.",
				"Interesting fact: a coconut palm tree disperses its seed using the ocean since coconuts can float in the water"]
		case "watermelon":
			return ["Did you know about 92 percent of a watermelon is water? That’s a lot of water!",
				"Here is a fun fact: some people say that watermelons are actually vegetables! What do you think?",
				"Interesting fact: In China and Japan, watermelon is a popular gift to bring a host."]
		case "papaya":
			return ["Did you know there are two types of papayas? Hawaiian and Mexican!",
				"Here is a fun fact: A Papaya is sometimes referred to as a “tree melon.” In Australia it is called Papaw or Paw Paw!",
				"Interesting fact: The bark of the papaya tree is often used to make rope!"]
		case "cantaloupe":
			return ["Did you know that no one knows exactly where a cantaloupe first showed up? It is a still a mystery!",
				"Here is a fun fact: Cantaloupes tell you when they are ripe! The vine will naturally slip from the cantaloupe.",
				"Interesting fact: Cantaloupe is the most popular type of melon in the USA."]
		case "honeydew":
			return ["Did you know honeydews only mature when they are on the vine? That means they do not become sweeter with time after harvesting!",
				"Here is a fun fact: Honeydew is 90 percent water! It is great for hydrating yourself.",
				"Interesting fact: Honeydew is a great source of vitamin C which is great for your immune system and skin!"]
		case "grapefruit":
			return ["Did you know grape fruit is around 92% water? It has similar water contents as a watermelon!",
				"Here is a fun fact: many say that grapefruits tastes the best at room temperature. Try it out yourself and see if you agree!"]
		case "lemon":
			return ["Did you know lemon tree leaves can be used to make tea? I love tea!",
				"Here’s a fun fact: lemon trees produce fruit all year round! Yay, we can have lemons every day! "]
		case "pear":
			return ["Here’s a cool fact: pears are part of the rose family. No wonder they smell so nice!",
				"Did you know that the word pyriform means “pear-shaped”? I love expanding my vocabulary!"]
		case "peach":
			return ["Did you know peaches are called stone fruits? It is because of the hard pits surrounding their seeds!",
				"Here’s a cool fact: in China, the peach is symbolic of longevity and good luck! Eat more peach!"]
		case "lime":
			return ["Did you know that lime produces star-shaped flowers? That’s so cool!",
				"Here’s a cool fact: if ultraviolet light is directed at the skin of a person that has touched lime juice, the area of skin may become blistered, swollen or darker."]
		case "cherry":
			return ["Did you know that the world record for cherry-pit spitting is nearly 30 metres? Don’t try this at home!",
				"Here’s a cool fact: When Roman soldiers travelled, they threw away their cherry pits, and these pits eventually grew into cherry trees! Beautiful!",
				"Did you know that we’ve been eating cherries since the Stone Age? Wow!"]
		case "apricot":
			return ["Did you know that January 9th is National Apricot Day? Get ready to celebrate!",
				"Here’s a fun fact: apricots are a great source of vitamin A, so they’re great for improving your eye health!",
				"Did you know that apricots have been around for over 4000 years? Wow, that’s even older than me!"]
		case "plum":
			return ["Did you know that some types of plum are cultivated to use as ornaments because of the beautiful flowers they produce? Wow!",
				"Here’s an interesting fact: the dried form of a plum, called a prune, is often consumed in the winter when the fresh fruit is not available. Both plums and prunes are delicious!"]
		case "grape":
			return ["Did you know that grapes are 80 percent water? If you’re ever feeling thirsty, consider eating some grapes!",
				"Guess what? There are over 8000 grape varieties worldwide! That’s a huge number!",
				"Here is an interesting fact: the average person eats 3.6 kg of grapes a year. That’s like, 180 sushis!"]
		case "kiwi":
			return ["Did you know that animals like monkeys and deer also eat kiwi? We’re not alone!",
				"Here is a fun fact: kiwis have two times as much vitamin C as oranges do! A kiwi a day keeps the doctor away!",
				"Here is an interesting fact: kiwi has heart-shaped leaves! Isn’t that cute? Spread the love! "]
		case "lychee":
			return ["Did you know that lychee is a symbol of love and romance in China? How sweet!",
				"Here is an interesting fact: lychee seeds contain toxic compounds that can do damage to your digestive system. Be careful not to consume any seeds!"]
		case "raspberry":
			return ["Did you know that each raspberry consists of around 100 individual tiny fruits, called drupelets? That’s so cool!",
				"Here is a fun fact: raspberries produce flowers during its second year of growth. Beautiful! ",
				"Here is an interesting fact: when ripe raspberries are harvested, their stems remain on the plant, so that’s why there’s always a hole in the middle of the raspberry! Hole-y moley!",
				"You may have guessed cherry, but did you know cherries are not actually berries? They are actually drupes!"]
		case "dragonfruit":
			return ["Did you know that a dragonfruit only stays alive for one night? How precious!",
				"Did you know that another name for dragonfruit is Pitaya? Isn’t that strange?"]
	}
}
