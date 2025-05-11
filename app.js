const mysql = require('mysql2');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
app.use(cors());
app.use(express.json())


    const secretKey = 'ayush mishra';


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ayush@124',
  database: 'test',
});

connection.connect((err) => {
  if (err) {
    console.log('Connection error:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});

// 3. Prepare insert query with multiple rows
const insertQuery = `
  INSERT INTO allquestion
  (question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, category)
  VALUES ?
`;

// 4. Data to insert
const questions = [
  ['What is the capital of India?', 'Mumbai', 'New Delhi', 'Kolkata', 'Chennai', 'B', 'Easy', 'Geography'],
  ['Which planet is known as the Red Planet?', 'Earth', 'Venus', 'Mars', 'Jupiter', 'C', 'Easy', 'Science'],
  ['What is 2 + 2?', '3', '4', '5', '6', 'B', 'Easy', 'Math'],
  ['Who wrote the Ramayana?', 'Valmiki', 'Tulsidas', 'Vyas', 'Kalidas', 'A', 'Medium', 'History'],
  ['Which is the largest ocean?', 'Atlantic', 'Indian', 'Pacific', 'Arctic', 'C', 'Medium', 'Geography'],
  ['Who discovered gravity?', 'Newton', 'Einstein', 'Tesla', 'Galileo', 'A', 'Medium', 'Science'],
  ['Which language is used to style web pages?', 'HTML', 'Python', 'CSS', 'C++', 'C', 'Easy', 'Technology'],
  ['What is the boiling point of water?', '90°C', '100°C', '80°C', '120°C', 'B', 'Easy', 'Science'],
  ['What is the square root of 64?', '6', '7', '8', '9', 'C', 'Easy', 'Math'],
  ['Which gas do plants use for photosynthesis?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen', 'C', 'Medium', 'Science'],
];
   


app.post('/rg', (req, res) => {

  const { nam, email, pass } = req.body;
  console.log(req.body);
  
  const hashedPassword = bcrypt.hashSync(pass, 10);

  const query = 'INSERT INTO loginconfirm (nam, email, pass) VALUES (?, ?, ?)';
  connection.query(query, [nam, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).json({ error: 'User already exists or error occurred' });
    res.json({ message: 'User registered successfully' });
    console.log('User registered successfully');
    
  });
});


app.post('/login', (req, res) => {
  const { email, pass } = req.body;
  console.log(req.body);
  
  const query = 'SELECT * FROM loginconfirm WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid email' });

    const user = results[0];
    const passwordMatch = bcrypt.compareSync(pass, user.pass);
    if (!passwordMatch) return res.status(401).json({ error: 'Wrong password' });

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    console.log(token);
    
    res.json({ message: 'Login successful', token });
  });
});



function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}










  const refresh = new Set();
app.get('/',verifyToken,(req,res)=>{
   
  const countquery = 'select count(*) as count from allquestion';

     if(refresh.size > 0){
       const countid = [...refresh].join(',')
       countquery += countid 
     }

     connection.query(countquery,(err,result)=>{
       if(err){
        console.log(err);
       }

       else{
        console.log(result);
       }
     })

     const randomquery = 'select * from allquestion order by rand() limit 2';

     connection.query(randomquery,(err, result)=>{
        if(err){
          console.log(err);
        }

        else{
          console.log(result);
          res.send(result)
          
        }
     })

})

app.listen(5000,(err)=>{
  if(err){
  console.log(err);
  }
  else{
    console.log('sever is running on path http://localhost:5000');
    
  }
})





