import { MongoClient, ObjectId } from 'mongodb';

const state = {
    db: null,
}

const connect = (url, done) => {
    if (state.db) return done()
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) return done(err)
        state.db = client.db('base_of_books')
        console.log("Successfully Connected to MongoDB!")
        done()
    })
}

const getCollection = (collectionName) =>  state.db.collection(collectionName)

const getDB = () => state.db

const close = (done) => {
    if (state.db) {
        state.db.close((err, result) => {
            state.db = null
            // state.mode = null
            done(err)
        })
    }
}

export default {
    connect,
    getCollection,
    getDB,
    close,
    ObjectId
}