
require('dotenv').config()
const exprees = require('express');
const app = exprees();
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// console.log(process.env.SECRET_KEY) 

//MIDDlE WEAERE
app.use(cors());
app.use(exprees.json())




const uri =`mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASS}@cluster0.y3jqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

     const database = client.db("servicesDB");
      const servicesCollection = database.collection("services");
     

     //start db


     app.get('/servicses', async (req, res) => {
        const services = servicesCollection.find()
        const result = await services.toArray();
        res.send(result);
     })

     app.post('/servic', async (req, res) => {
        const service = req.body;

        const result = await servicesCollection.insertOne(service);
        res.send(result)
        
     });
    
    // single page

    app.get('/services/:id', async (req, res) => {
     const id = req.params.id; // Retrieve the service id from URL params
     const query = { _id: new ObjectId(id) }; // Query to find the service by id
     const service = await servicesCollection.findOne(query); // Get the  service from DB
     if (service) {
        res.send(service); // If service found, send it back
     } else {
        res.status(404).send({ message: "Service not found" }); // If service not found, return error
      }
   });  

    // delete

    app.delete('/servicess/:id', async (req, res) => {
     const id = req.params.id; 
      const query = { _id: new ObjectId(id) }
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });

    //update
  app.get('/servisee/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await servicesCollection.findOne(query);
    res.send(result);
   });

// আপডেট API
  app.put('/serviseed/:id', async (req, res) => {
    const id = req.params.id;
    const updatedService = req.body;  // এখানে সার্ভিসের নতুন ডেটা body থেকে আসবে

    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };

    const updateDoc = {
      $set: updatedService,  // সার্ভিসের নতুন ডেটা
    };

    const result = await servicesCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  });





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
   res.send('servisces server is runninge....')
})


app.listen(port, () => {
  console.log(`servisces server is runninge port:: ${port}`);
  
})