const {connection} = require('./connection');



 exports.get = (req, res) => {
  res.send('<h1>Welcome to the School Management API!</h1><p>Use the /plus endpoint to add school information (via POST) and /gt endpoint to get nearby schools (via GET).</p>');
};



    exports.plus = (req,res)=>{
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
};




  exports.list = (req,res)=>{
   const latitude = req.query.latitude;
   const longitude = req.query.longitude;
console.log(latitude,longitude);

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
   
};