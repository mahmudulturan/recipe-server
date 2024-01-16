const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 4000;

//middlewares
app.use(cors());
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("Recipe Rover server is running")
})

app.listen(port, ()=> {
    console.log(`Recipe Rover server is running ${port}`);
})