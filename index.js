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

    const userId = req.cookies.uuid;
    const user = getuser(userId);
    const id = user.id;
    const urls = await url.find({user:id})
    console.log(urls)
    if(urls){
        res.render('home',{urls:urls});
    }else{
        res.render('home',{urls:[]})
    }

    

})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.get('/login',(req,res)=>{
    res.render('login')
})




app.post('/signup',async(req,res)=>{


    try{
    const {name,email,password} = req.body

    
    if(!name||!email||!password){

        res.status(403).send('all the inputs should be filled ')
    }

    const olduser = await user.findOne({
        email

    })
    if (olduser) {
        return res.render('message', {
            route: 'login'
        });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await user.create({
        name:name,
        email:email,
        password:hashedPassword
    })
  
 
    res.redirect('/login')

    }
    catch(err){
        res.status(500).send("error occured")
    }

 
})



app.post('/login',async(req,res)=>{


    try{
        const {email,password} = req.body
    
        
        if(!email||!password){
    
            res.status(403).send('all the inputs should be filled ')
        }
    
    
        const olduser = await user.findOne({
            email
    
        })
        
            if(!olduser){
                res.render('message',{route:'signup'})
            }
        else{
            bcrypt.compare(password,olduser.password,(err,result)=>{

                if(err){
                    res.status(500).send('Error ocuured :')
                }
                else if(result){
                    const id= uuidV4();
                    setuser(id,olduser);
                    res.cookie('uuid',id)
                    res.redirect('/')
                }
                else{
                    res.redirect('/login')
                }
            })
            
        }
        
      
    
    }catch(err){
        res.status(500).send('user is not created')
    }
     
    })


    app.post('/url', async (req, res) => {

        try{
        const  originalUrl  = req.body.URL;
     

        if (!originalUrl) {
          return res.status(400).send('The "originalUrl" field is required.');
        }
      
        const userId = req.cookies.uuid;
        const user = getuser(userId);
        const id = user.id;
      
        // Generate a unique short URL
        const shortUrl = shortid.generate();
      
        // Save the URL in the database
        const Url = await url.create({ user: id, fullurl: originalUrl, shorturl: shortUrl });
      
        res.redirect('/');
    }
    catch(err){
        console.log('error occured')
    }
      });
      


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