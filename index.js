const express = require('express')
const app = express()
const port =process.env.PORT || 3000
app.use(express.json());
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
var cors = require('cors')
app.use(cors())
app.get('/', (req, res) => {
  res.send('Server Active!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.hwuf8vx.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db("coffeDB");
    const coffeCalaction = database.collection("coffe");
    app.post('/coffe',async(req,res)=>{
        const newCoffe=req.body;
        console.log('Add Coffe',newCoffe)
        const result = await coffeCalaction.insertOne(newCoffe);
        res.send(result)
    })
    app.get('/coffe',async(req,res)=>{
      const cursor =  coffeCalaction.find()
      const result=await cursor.toArray()
      res.send(result)
    })
    app.get('/coffe/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id) }
      const result= await coffeCalaction.findOne(query)
      res.send(result)
    })
    app.put('/coffe/:id',async(req,res)=>{
      const id=req.params.id
      const Update={_id: new ObjectId(id) }
      const options = { upsert: true };
      const updateCoffes= req.body;
      const updateCoffe = {
        $set: {
          name: updateCoffes.name,
          quantity:updateCoffes.quantity,
          supplier: updateCoffes.supplier,
          taste: updateCoffes.taste,
          category:updateCoffes.category,
          details: updateCoffes.details,
          photo: updateCoffes.photo
        },
      };
      const result = await coffeCalaction.updateOne(Update, updateCoffe, options);
      res.send(result)
    })
    app.delete('/coffe/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id) }
      const result= await coffeCalaction.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})