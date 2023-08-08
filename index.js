const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
// for the access userData body data
app.use(express.json());

// mongodb+srv://<username>:<password>@cluster0.poyqe.mongodb.net/?retryWrites=true&w=majority
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poyqe.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
    try {
         client.connect()
        const database = client.db('Jerins_Parlour');
        const appointmentCollection = database.collection('appointments');
        const usersCollection = database.collection('users');
        const commentCollection = database.collection('comments');
        const serviceCollection = database.collection('services');
        console.log('your database running')

        // POST
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
            // console.log(appointment)
            res.json(result)
            // res.json({message:'sakilhere'})
        })
        app.post('/service', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result)
            // res.json({message:'sakilhere'})
        })

        // GET

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
            const query = { email: email }
            const cursor = appointmentCollection.find(query);
            const services = await cursor.toArray();
            // console.log(comments)
            res.json(services);
        })
        // check user admin or not
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ isAdmin: isAdmin })
        })




        // put
        // if user exist update user else insertUser
        app.put('/users', async (req, res) => {
            const user = req.body;
            // console.log(user)
            const filer = { email: user.email };
            const option = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filer, updateDoc, option);
            res.json(result)
        })
        // make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            // console.log('in server',result,req.body)
            res.json(result);

        })
        //  changeAction according to need
        app.put('/appointment/action', async (req, res) => {
            const user = req.body;
            // console.log(user)
            const filter = {_id: new ObjectId(user.id) };
            const updateDoc = { $set: { action: user.action } };
            const result = await appointmentCollection.updateOne(filter, updateDoc);
            res.json(result);
            // res.json({message:'sakilhere'})


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

