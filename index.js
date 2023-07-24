const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://Education:3HUhLa3wNy7vAJpV@cluster0.djxbtyf.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)

    // by category ||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    const collegeCollection = client.db("Education").collection("college");
    const usersCollection = client.db("Education").collection("users");
    const applyCollection = client.db("Education").collection("apply");
    const reviewCollection = client.db("Education").collection("review");

    // ============= USERS =============

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // get all college
    app.get("/college", async (req, res) => {
      const result = await collegeCollection.find({}).toArray();
      res.send(result);
    });
    // find one
    app.get("/college/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = await collegeCollection.findOne(query);
      res.send(data);
    });

    // Apply College
    app.post("/apply", async (req, res) => {
      const data = req.body;
      const result = await applyCollection.insertOne(data);
      res.send(result);
    });

    // get, some user updated toy data
    app.get("/apply", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await applyCollection.find(query).toArray();
      res.send(result);
    });

    // find one
    app.get("/apply/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = await applyCollection.findOne(query);
      res.send(data);
    });

    // delete apply college
    app.delete("/apply/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete id", id);
      const query = { _id: new ObjectId(id) };
      const result = await applyCollection.deleteOne(query);
      res.send(result);
    });

    // Add Review
    app.post("/review", async (req, res) => {
      const data = req.body;
      const result = await reviewCollection.insertOne(data);
      res.send(result);
    });

    // get all review
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running...........");
});
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
