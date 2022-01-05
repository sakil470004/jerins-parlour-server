const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000

// middleWare
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
        const commentCollection = database.collection('comments');
        const serviceCollection = database.collection('services');
        console.log('your database running')

        //post comment data to comment and insert data to mongodb
        app.post('/comment', async (req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);

            res.json(result)

            // res.json({message:'sakilhere'})
        })
        // post a appointment data
        app.post('/appointment', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentCollection.insertOne(appointment);
            console.log(appointment)
            res.json(result)
            // res.json({message:'sakilhere'})
        })
        //get all the comments 
        app.get('/comment', async (req, res) => {
            const cursor = commentCollection.find({});
            const comments = await cursor.toArray();
            // console.log(comments)
            res.json(comments);
        })
          //get all the services 
          app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            // console.log(comments)
            res.json(services);
        })
        
          //get all the appointment 
          app.get('/appointment', async (req, res) => {
            const cursor = appointmentCollection.find({});
            const services = await cursor.toArray();
            // console.log(comments)
            res.json(services);
        })
          //get current user appointment 
          app.get('/appointmentUser', async (req, res) => {
            const email = req.query.email;
            const query= {email:email}
            const cursor = appointmentCollection.find(query);
            const services = await cursor.toArray();
            // console.log(comments)
            res.json(services);
        })


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

