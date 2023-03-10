const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User');

// Password handler
const bcrypt = require('bcrypt');



//Signup
router.post('/signup', (req, res) => {
let {nom,prenom , email,password }= req.body;
nom=nom.trim();
prenom=prenom.trim();
email=email.trim();
password=password.trim();

if(prenom == "" ||nom == "" ||email == "" ||password == ""  ){
    res.json({
        status : "FAILED",
        message:"Empty input fields"


    });
} else if(!/^[a-zA-Z ]*$/.test(nom)){
    res.json({
        status : "FAILED",
        message:"Invalid name entered"

    })
} else if(!/^[a-zA-Z ]*$/.test(nom)){
        res.json({
            status : "FAILED",
            message:"Invalid name entered"
    
        })
    


} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
    res.json({
        status : "FAILED",
        message:"Invalid email entered"

    })

} else if (password.length<8){
    res.json({
        status : "FAILED",
        message:"Password is too short!"

    })

} 
// cheking if user already exists
else {
    User.find({email}).then(result => {
     if (result.length){
         // user already exists
         res.json({
            status : "FAILED",
            message:"user with the provided email already exists"

         })
     }else {
        //try to create new user



        // password handling
        const saltRounds = 10;
        bcrypt.hash(password , saltRounds).then(hashedPassword => {
         const newUser = new User({
           nom,
           prenom,
           email,
           password: hashedPassword

          });
         newUser.save().then(result => {
            res.json({
                status : "SUCCESS",
                message:"Signup successful",
                data: result ,

             })
           
         })
         .catch(err => {
            res.json({
                status : "FAILED",
                message:"An error occured while saving user account "
             })
        })


        })
        .catch(err => {
            res.json({
                status : "FAILED",
                message:"An error occured while hashing password!"
             })
        })
      }
   
    }).catch(err => {
         console.log(err);
         res.json({
            status : "FAILED",
            message:"An error occured while checking for existing user"
         })
     })

}

})

//Signin 
router.post('/signin',(req,res)=>{
let { email,password }= req.body;

email=email.trim();
password=password.trim();
if( email == "" ||password == ""  ){
    res.json({
        status : "FAILED",
        message:"Empty input fields"


    });
} else{
    // check if user exist
    User.find({email})
    .then(data => {
        if(data.length){
            //User exists
            const hashedPassword = data[0].password;
            bcrypt.compare(password,hashedPassword).then(result => {
            if(result){
            //password match
                 res.json({
                 status : "SUCCESS",
                 message:"Signin successful",
                 data: data
        
                })

            } else{
                res.json({
                    status : "FAILED",
                    message:"Invalid password entered"
           
                   })


            }

            })
             .catch(err => {
                res.json({
                    status : "FAILED",
                    message:"Invalid password entered"
           
                   })


             })
        } else{
            res.json({
                status : "FAILED",
                message:"Invalid credentials entered"
       
            })

        }

    })
    .catch(err => {

        res.json({
            status : "FAILED",
            message:"An error exisiting while checking  for exisiting user"
       

        })

    })







}
})
module.exports=router;