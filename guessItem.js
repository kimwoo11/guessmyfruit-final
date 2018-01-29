var jsonQuery = require("json-query");
var readlineSync = require("readline-sync");
var _ = require("underscore");

const fruitData = {
  "items" : [
    {
      "name": "mango",
      "sizeTennisBall": "larger",
      "colourInside": ["yellow", "orange"],
      "numberSeeds": "one",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "zero",
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
      "numberSeeds": "zero",
      "colourOutside": ["brown"],
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "one",
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
      "numberSeeds": "one",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "one",
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
      "numberSeeds": "one",
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
      "numberSeeds": "many",
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
      "numberSeeds": "many",
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
      "numberSeeds": "one",
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

function guessItem() {
  var gameData = _.clone(fruitData);

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

    var response = queryUser(attributeTagMax);

    var items = jsonQuery(`items[*${attributeTagMax}${op}${response}]`, {data : gameData}).value;

    gameData.items = items;
    gameData.attributes.splice(index, 1);

    console.log(gameData);
  }

  switch(gameData.items.length) {
    case 0: return "unknown";
    case 1: return gameData.items[0].name;
    default: return "multiple";
  }
}

function queryUser(attrib) {
  return readlineSync.question(`${attrib}? `);
}

console.log(guessItem());
