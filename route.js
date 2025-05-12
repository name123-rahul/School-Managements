
module.exports = (app)=>{
const controll = require('./controller');

app.get('/',controll.get);
app.post('/addSchool',controll.plus);
app.get('/listSchools',controll.list)
}

