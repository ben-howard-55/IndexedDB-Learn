import Dexie from 'dexie';

const db_name = 'fc-demo';
let db = new Dexie(db_name)

db.version(1).stores({
    // Only need to define schema of indexes and primary key
    userWords: '++id,level,front,back'
})

async function test() {
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

        // show first word
        text.innerHTML = "What is the translation of: " +  front[0];
    });
}



test().catch (err => {
    console.error ("Uh oh! " + err.stack);
});