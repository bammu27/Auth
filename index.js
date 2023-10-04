const express  = require('express')
const mongoose = require('mongoose');
const user = require('./models/user');
const { name } = require('ejs');
const{v4:uuidV4} = require('uuid')
const cookieParser = require('cookie-parser');
const{getuser,setuser} = require('./service/cookie')
const url = require('./models/url')
const bcrypt = require('bcrypt');
const shortid = require('shortid');
require('dotenv').config();



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


async  function auth (req, res, next){
    const userId = req.cookies.uuid;
  
    const user = getuser(userId);
  
    if (user) {
      // User exists in the session
 
      next();
    } else {
      // User not found, handle this case (e.g., redirect to login)
      res.redirect('/login');
    }
  };
 
  





app.get('/', auth,async(req, res) => {

 
    

})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.get('/login',(req,res)=>{
    res.render('login')
})




app.post('/signup',async(req,res)=>{


   

 
})



app.post('/login',async(req,res)=>{


    
  
     
    })


mongoose.connect(process.env.MONGO_URL,
{useNewUrlParser: true,
useUnifiedTopology: true},

).then(()=>{
    console.log('Database is connected')
    app.listen(5000,()=>{
        console.log('server is running on port:5000')
    })
}).catch((err)=>{
    console.log('error in connecting database')
})