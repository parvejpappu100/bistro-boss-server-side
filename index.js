const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// * Middleware:
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdnsrak.mongodb.net/?retryWrites=true&w=majority`;

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

    const menuCollection = client.db("bistroDB").collection("menu");
    const reviewsCollection = client.db("bistroDB").collection("reviews");
    const cartsCollection = client.db("bistroDB").collection("carts");

    // * To get all menu data:
    app.get("/menu" , async(req , res) => {
        const result = await menuCollection.find().toArray();
        res.send(result)
    })

    // * To get reviews data:
    app.get("/reviews" , async(req , res) => {
        const result = await reviewsCollection.find().toArray();
        res.send(result)
    });

    // * Cart Collection : 

    // * For get carts information:
    app.get("/carts" , async(req , res) => {
      const email = req.query.email;
      if(!email){
        res.send([]);
      }
      const query = {email:email};
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    })

    // * For add to cart and store data on database:
    app.post("/carts" , async(req , res) => {
      const item = req.body;
      const result = await cartsCollection.insertOne(item);
      res.send(result);
    });

    // * For delete cart item:
    app.delete("/carts/:id" , async(req , res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
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

app.get("/" , (req , res) => {
    res.send("Bistro Boss Server Is Running")
});

app.listen(port , () => {
    console.log(`Bistro boss server is running on port : ${port}`)
})