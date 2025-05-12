const {connection} = require('./connection');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json())
app.use(cors());

connection.connect((err)=>{
     if(err){
        console.log(err);
     }

     else{
        console.log('successfully connect.....');
        
     }
})

     require('./route')(app)

app.listen(5000,()=>{
console.log('server is running on path http://localhost:5000');

})