const express = require('express')
const mongoose = require('mongoose')
const Users = require('./routes/UserRoutes')
const Task = require('./routes/TaskRoutes')

const dotenv = require('dotenv')
    
dotenv.config();



const app = express()
const port = process.env.PORT


const url = `${process.env.DB_CONNECT}`;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Successfully connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

app.use("/user", Users)

app.use("/tasks", Task)

app.set('view engine', 'ejs');

app.get('/hii', (req,res) => {
    res.render('home', { name: 'Roshan', data:{message:'hello',title:'over'} });
})


app.listen(port, () => {
  console.log(`My app listening on port ${port}`)
})