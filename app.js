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

app.post('/plus',(req,res)=>{
    const {schoolname,address,latitude,longitude} = req.body;

    if (!schoolname||!address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid input' });
  }
    
     const plusquery = 'insert into school_information(schoolname,address,latitude,longitude) values(?,?,?,?)';

     connection.query(plusquery,[schoolname,address,latitude,longitude],(err,result)=>{
             if(err){
                console.log(err);
                 res.status(500).json({ error: "Something went wrong with the database" }); 
             }

             else{
                console.log(result.insertId);
                res.status(201).json({ message: "Location added successfully" });
                
             }
     })
})









app.post('/gt',(req,res)=>{
   console.log(req.body);
   const {latitude,longitude} = req.body;
const getquery = `
  SELECT 
    schoolname, address, latitude, longitude,
    (6371 * acos(
      cos(radians(?)) * cos(radians(latitude)) *
      cos(radians(longitude) - radians(?)) +
      sin(radians(?)) * sin(radians(latitude))
    )) AS distance
  FROM school_information
  ORDER BY distance ASC
  LIMIT 10
`;                // query ke according  jaise query me latitude ,longitude ,latitude
   connection.query(getquery,[latitude,longitude,latitude],(err,result)=>{
       if(err){
        console.log(err);
       }

       else{
        console.log(result);
        res.send(result)
        
       }
   })
   
})

app.listen(5000,()=>{
console.log('server is running on path http://localhost:5000');

})