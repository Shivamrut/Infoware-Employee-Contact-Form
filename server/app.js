// importing modules
const express = require('express');
const dotenv = require('dotenv');
const Dbservice = require('./db');
const cors = require('cors');

// configuring modules
dotenv.config();
const app = express();
const env = process.env;


// express config
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

// CREATE
// app.post('/insert', (req,res)=>{
//     // console.log(req.body);
//     const {name} = req.body;
//     const db = dbService.getDbServiceInstance();
//     const result = db.insertNewName(name);

//     result
//     .then(data => res.json({data:data}))
//     .catch(err => console.log(err));
    
// });


// // READ
app.get('/getData',(req,res)=>{
    const db = Dbservice.getSingleInstance();
    const result = db.getAllData();
    result
    .then((data) => {
        res.json({
            data:data
        });
        // console.log(data);
        
    }).catch((err) => {
        console.log('Error in /getData');
        console.log(err);
    });
})


// // UPDATE

// // delete
// app.delete('/delete/:id',(req,res)=>{
//     console.log(req.params);
//     const id = req.params.id;
//     const db = Dbservice.getDbServiceInstance();
//     const result = db.deleteRow(id);
//     result 
//     .then(data => res.json({
//         success : data
//     }))
//     .catch(err=>console.log('Error in post delete : ', err));
// })


// edit
app.patch('/editName',(req,res)=>{
    // console.log(req.body);
    const body = req.body;
    // console.log('body: ', body);
    const {name, id} = req.body;
    console.log(name,id);
    const db = Dbservice.getSingleInstance();
    const result = db.editName(id,name);
    result 
    .then(data => res.json({
        success : data
    }))
    .catch(err=>console.log('Error in patch edit : ', err));
    
})



// server
app.listen(env.PORT,env.HOST, ()=>{
    console.log(`App is running at http://${env.HOST}:${env.PORT}/getAll`);
})