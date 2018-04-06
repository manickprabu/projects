
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const url = "http://localhost:3000/mydb";

MongoClient.connect(url, (err, db) => {
    console.log(err, db);

    db.close();
})