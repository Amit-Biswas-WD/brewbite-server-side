const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://history-client-side-66e3d.web.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.zyvach0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Send a ping to confirm a successful connection

    const categoryCollection = client.db("Brew_Bite").collection("coffees");
    const ordersCollection = client.db("Brew_Bite").collection("orders");

    // coffees some data
    app.get("/coffees", async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result);
    });

    // coffees single data
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    // create orders data
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      res.send(result);
    });

    // Specific email some orders data
    app.get("/orders", async (req, res) => {
      const email = req.query?.email;
      let query = {};

      if (email) {
        query = { email: email };
      }

      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });

    // orders single data
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ordersCollection.findOne(query);
      res.send(result);
    });

    // order delete specific id
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });

    // order Update specific id
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updatedInfo = req.body;
      console.log(updatedInfo);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateValue = {
        $set: {
          "customerInfo.customerName": updatedInfo.customerName,
          "customerInfo.orderDate": updatedInfo.orderDate,
          "customerInfo.location": updatedInfo.location,
        },
      };
      const result = await ordersCollection.updateOne(
        filter,
        updateValue,
        options
      );
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Brew Bite is Running");
});

app.listen(port, () => {
  console.log(`Brew Bite listening on port ${port}`);
});
