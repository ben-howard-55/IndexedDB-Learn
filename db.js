import Dexie from 'dexie';

const db_name = 'fc-demo';
let db = new Dexie(db_name)

// define schema
db.version(1).stores({
    // Only need to define schema of indexes and primary key
    userWords: '++id,level,front,back'
})

// global srl variables
let deck = []
let position = 0
let numCards = 0
let flipped = false 

async function loadDB() {
    // open the db
    db.open()

    // if created for first time populate default data
    db.on("populate", () => {
        console.log("populated DB");

        let front = ['Hello', 'Dog', 'Cat', 'Yes', 'No'];
        let back = ['Hallo', 'Hund', 'Katze', 'Ja', 'Nein'];

        let questions = [];
        for (let i = 0; i < 5; i++) {
            questions.push({
                level: Math.floor(Math.random() * 6) + 1,
                front: front[i],
                back: back[i]
            });
        }

        // bulk add default questions
        db.userWords.bulkAdd(questions)
    });
}

async function loadDeck() {
    // read DB for number of cards
    db.userWords.toCollection().count(function (count) {
        console.log("number of words: " + count);
        numCards = count;
        number.innerHTML = count + " Cards";
    })

    // save cards in the deck
    await db.userWords.toCollection().toArray(function (array) {
        deck = array;
        console.log(deck)   
    })
    
    // show first word
    text.innerHTML = "What is the translation of: " +  deck[0].front;
}

// load
loadDB().then(
    // once loaded send to srl logic
    loadDeck()
    
).catch (err => {
    console.error ("error: " + err.stack);
});

// on flip button press 'flip' card
window.flipCard = function() { 
    if (flipped) {
        text.innerHTML  = "What is the translation of: " + deck[position]['front'];
        flipped = !flipped;
    } else {
        text.innerHTML  = "The translation is: " + deck[position]['back'];
        flipped = !flipped;
    }
}

function nextCard() {
    if (position >= numCards) {
        text.innerHTML = "Finished the deck!";
    } else {
        position++;
        flipped = false;
        text.innerHTML  = "What is the translation of: " + deck[position]['front'];
    }

}

window.badUnderstanding = function() {
    console.log("bad understanding!");

    if (position >= numCards) {
        text.innerHTML = "Finished the deck!";
    } else {
        // reset level to 1
        let id = deck[position]['id']

        db.userWords.update(id, {level: 1}).then(function (updated) {
            if (updated)
                console.log("reset level to 1 of card:" + id);
            else
                console.log("No update needed (already level 1)");
        })

        nextCard()
    }
}

window.okUnderstanding = function() {
    console.log("badUnderstanding");

    if (position >= numCards) {
        text.innerHTML = "Finished the deck!";
    } else {
        // increase level by 1
        let id = deck[position]['id'];
        let level = deck[position]['level'];

        db.userWords.update(id, {level: level + 1}).then(function (updated) {
            if (updated)
                console.log("added 1 level to card:" + id);
            else
                console.log("No id match found");
        })

        nextCard()
    }
}

window.goodUnderstanding = function() {
    console.log("goodUnderstanding");

    if (position >= numCards) {
        text.innerHTML = "Finished the deck!";
    } else {
        // increase level by 2
        let id = deck[position]['id'];
        let level = deck[position]['level'];

        db.userWords.update(id, {level: level + 2}).then(function (updated) {
            if (updated)
                console.log("added 2 level to card:" + id);
            else
                console.log("No id match found");
        })

        nextCard();
    }       
}