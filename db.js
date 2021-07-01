import Dexie from 'dexie';

const db_name = 'fc-demo';
let db = new Dexie(db_name)

let deck = []

db.version(1).stores({
    // Only need to define schema of indexes and primary key
    userWords: '++id,level,front,back'
})

async function loadDB() {
    // open the db
    db.open()

    // if created for first time populate data
    db.on("populate", () => {
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
        db.userWords.bulkAdd(questions)
    });
}

async function loadDeck() {
    // read DB for cards
    var res = await db.userWords.get(1);
    console.log(res);

    db.userWords.toCollection().count(function (count) {
        console.log("number of words: " + count);
    })

    await db.userWords.toCollection().toArray(function (array) {
        deck = array;
        console.log(array);
    })
    console.log(deck)
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