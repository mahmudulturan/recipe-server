const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config()
const port = process.env.port || 4000;

//middlewares
app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hzybyvu.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        // collections
        const RecipeCollection = client.db("recipeRover").collection("recrecipeCollection")


        // endpoint for get all recipe
        app.get('/all-recipe', async (req, res) => {
            const { searchKey } = req.query;
            let query = {};
            if (searchKey) {
                query = {
                    $or: [
                        { title: { $regex: new RegExp(searchKey, 'i') } },
                        { ingredients: { $regex: new RegExp(searchKey, 'i') } }
                    ]
                };
            }
            const result = await RecipeCollection.find(query).toArray();
            res.send(result);
        });


        // endpoint for get a recipe
        app.get('/all-recipe/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await RecipeCollection.findOne(query)
            res.send(result);
        })

        //endpoint for post new recipe
        app.post('/add-recipe', async (req, res) => {
            const data = req.body;
            const result = await RecipeCollection.insertOne(data);
            res.send(result)
        })

        app.put('/update-recipe/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    title: data.title,
                    image: data.image,
                    ingredients: data.ingredients,
                    instructions: data.instructions
                }
            }
            const result = await RecipeCollection.updateOne(filter, updatedDoc)
            res.send(result);
        })

        //endpoint for post new recipe
        app.delete('/delete-recipe/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await RecipeCollection.deleteOne(filter);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Recipe Rover server is running")
})

app.listen(port, () => {
    console.log(`Recipe Rover server is running ${port}`);
})