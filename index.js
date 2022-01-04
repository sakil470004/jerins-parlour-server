const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000


app.use(cors())
// for the access userData body data
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poyqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect()
        const database = client.db('Jerins_Parlour');
        const appointmentCollection = database.collection('appointments');
        const usersCollection = database.collection('users');
        console.log('your database running')



    } finally {
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello Jarins perlar!')
})

app.listen(port, () => {
    console.log(`this feaking app listening http://localhost:${port}`)
})

