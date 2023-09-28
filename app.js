const express = require('express')
const bcrypt = require('bcrypt')
const path = require('path')
const session = require ('express-session')
const flash = require('connect-flash')
const app = express()
const connectDB = require('./utils/connectDB')
const User = require('./model/reguser')
const Admin = require('./model/admin')

//creating mongodb session and protecting route


app.use(session({
    secret: 'keyboard cat', //gives u a unique id in the session
    saveUninitialized:true,
    resave:true    
    }))
    
app.use(flash());

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

connectDB()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const port = 3000;

app.get('/', (req, res )=>{
    res.render('dashboard.ejs', {foundUser})
})

app.get('/register', (req, res)=>{
    res.render('register.ejs', {messages: req.flash('info')})
})

app.get('/login', (req, res)=>{
    res.render('login.ejs', {messages: req.flash('info')})
})

app.get('/adminReg', (req, res)=>{
    res.render('adminReg.ejs', {messages: req.flash('info')})
})

app.get('/admin', async (req, res)=>{
    const allUsers = await User.find()
    const allAdmin = await Admin.find()
    console.log(allUsers)
    console.log(allAdmin)
    res.render('admindashboard.ejs', {allUsers, allAdmin})
})

app.get('/forgetpassword', (req, res)=>{
    res.render('forgetpassword.ejs', {messages: req.flash('info')})
})

app.post('/register', async (req, res)=>{
    try {
        const {username, password, passport, fullname, phone} = req.body
        console.log(req.body)
        const foundUser = await User.findOne({username:username})
        if(foundUser) {
            req.flash('info', 'User Already Exist')
            res.redirect('/register')
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User ({
            username:username,
            password:hashedPassword,
            fullname:fullname,
            passport:passport,
            phone:phone,
            active:true,
            role:'User'
        })
        await user.save()        
    } catch (error) {
        console.log(error)
        
    }
    res.redirect('/')
})

app.post('/adminReg', async (req, res)=>{
    try{
        const {username, password} = req.body
        console.log(req.body)
        const foundAdmin = await Admin.findOne({username:username})

        if (foundAdmin){
            req.flash('info', 'User Already Exist')
            res.redirect('/register')
        }
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new Admin({
            username:username,
            password:hashedPassword,
            role:'Admin',
            active:true
        })
        await user.save()
        console.log(user)
        
    } catch(error){
        console.log(error)
    }
    res.redirect('/admin')
})

let foundUser

app.post('/login', async (req, res)=>{
    const {username, password} = req.body
    foundUser = await User.findOne({username:username})

    if(foundUser){
        const user = await bcrypt.compare(password, foundUser.password)
        if (user){
            req.session.user = foundUser
            req.session.auth = true;
            res.redirect('/')
        }else{
            req.flash('info', 'Username or Password incorrect')
            res.redirect('/login')
        }
    }else{
        const foundAdmin = await Admin.findOne({username:username})
        if(foundAdmin){
            const user = await bcrypt.compare(password, foundAdmin.password)
            if(user){
                res.redirect('/admin')
            }else{
                req.flash('info', 'Username or Password incorrect')
                res.redirect('/login')
            } 
        }
    }
})

app.post('/logout', (req, res)=>{
    req.session.destroy((error)=>{
        if (err) throw err;
        res.redirect('/login')
    })
})

app.post('/forgetpassword', async (req, res) =>{
    const {username, newpassword} = req.body
    console.log({username, newpassword})
    const foundUser = await User.findOne({username:username})
    if (username.length<10 || newpassword.length<9){
        req.flash('info', 'username must be greater than 9 and password must be greater than 8')
    }
    else{
        const hashedpassword = await bcrypt.hash(newpassword, 10)
        const user = await User.findOneAndUpdate({username:username}, {$set:{password:hashedpassword}})
        console.log(user)

        req.flash('info', 'password updated')
        res.redirect('/login')
    }
})

app.delete('/:postid', async (req, res) =>{
    try {
        const postID = req.params.postid;
        const deletePost = await User.findByIdAndDelete(postID)
        res.redirect('/admin')
    }catch(error){
        console.log(error)
    }   
       
})

app.listen(port, ()=>{
    console.log('Server is currently running')
})