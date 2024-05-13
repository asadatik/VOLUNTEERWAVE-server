const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()


// middle
const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
     
    ],
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
  app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASs}@cluster0.ldjypij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // collections
    const PostCollection = client.db('Volunteers').collection('post')
    const RequestedCollection = client.db('Volunteers').collection('Request')


 // Save a job data in db
    app.post('/AddPost', async (req, res) => {
        const jobData = req.body
  
        const result = await PostCollection.insertOne(jobData)
        res.send(result)
      })    
        // Get all Posed data from db
        app.get('/AddPost', async (req, res) => {
            const result = await PostCollection.find().toArray()
      
            res.send(result)
          })
    
    // Get a single Add Post  data from collection using  id
    app.get('/post/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await PostCollection.findOne(query)
      res.send(result)
    })
    
    // get 6 data by MongoDB sort method//
    app.get('/six', async (req, res) => {
      const cursor =  PostCollection.find().sort({deadline: 1}).limit(6);
       const result =await cursor.toArray() ;
      res.send(result) ; 
    })
        
      // Filter by Email ( Organiger  )
    app.get("/managepost/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await PostCollection.find({ user_email: req.params.email }).toArray();
      res.send(result) 
    })
    // delete Oparation

    app.delete("/AddPost/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await PostCollection.deleteOne(query);
      res.send(result);
    });





  // Second Collection (   Request     )
    
     app.post('/Request', async (req, res) => {
      const bidData = req.body
      const result = await RequestedCollection.insertOne(bidData)
      res.send(result); 
    })
   


    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello  i am Volunteer')
})

app.listen(port, () => console.log(`Server running on port ${port}`))

