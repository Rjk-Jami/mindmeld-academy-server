
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')



require('dotenv').config()
//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Key}@cluster0.anem91w.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("MindMeldAcademy");
    const collegesCollection = database.collection("colleges");
    const graduatesCollection = database.collection("graduates");

    //search college
    app.get('/getCollegesByAlphabet', async (req, res) => {
        
            const letter = req.params.letter.toUpperCase(); // Convert to uppercase for case-insensitivity
            console.log(letter);
          const query = { name: { $regex: `^${letter}` } }; // Use a regular expression for matching the starting letter
    
          const colleges = await collegesCollection.find(query).toArray();
            console.log(colleges);
            res.send(colleges);
        

      
       
      });
      //get all colleges
    app.get('/colleges', async (req,res)=>{
        const colleges = await collegesCollection.find().toArray()
        // console.log(colleges)
        res.send(colleges)

      })
//get single college
      app.get(`/colleges/:id`, async(req,res)=>{
        const id = req.params.id
        const query = { _id : new ObjectId(id)}
        const college = await collegesCollection.findOne(query)
        res.send(college)

      })
      //get all graduates image
      app.get('/graduates', async (req,res)=>{
        const graduates = await graduatesCollection.find().toArray()
        console.log(graduates)
        res.send(graduates)

      })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Author - Raihan Jami Khan. Server: College ${port}`)
})