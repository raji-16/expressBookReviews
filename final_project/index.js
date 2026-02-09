const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized. Please provide a token" });
    }
  
    const token = authHeader.split(" ")[1]; // if format is "Bearer <token>"
  
    try {
      const decoded = jwt.verify(token, 'access'); // your secret key
      req.user = decoded; // store user info for later routes
      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
