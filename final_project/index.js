const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const JWT_SECRET="UZIB"

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const {token}=req.session.authorization
if(token){
    jwt.verify(token,JWT_SECRET,(err)=>{
        if(!err){
            next()
        }
        else{
            return res.status(403).send("User not authorised")
        }
    })
}else{
    return res.status(1).send("User not authenticated")
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
