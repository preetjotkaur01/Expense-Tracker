const express = require('express');
const app = express();
const connectToMongo = require('./db');
connectToMongo();
const cors = require('cors');

app.use(cors());

const port = 4000;
app.get('/', (req,res)=>{
    res.send("hello world");
});

app.use(express.json());

app.use('/api/auth' , require('./Routes/authentication'));
app.use('/api/account', require('./Routes/transaction'))


app.listen(port , ()=>{
    console.log(`App is listening on port ${port}`)
});
