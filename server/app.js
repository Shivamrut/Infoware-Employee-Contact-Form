// importing modules
const express = require('express');
const dotenv = require('dotenv');
const Dbservice = require('./db');
const cors = require('cors');
const getSheetData = require('./gspreadsheet');



// configuring modules
dotenv.config();
const app = express();
const env = process.env;


// express config
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());


// READ

// This endpoint handles retrieval of data from google spreadsheets and creation of employee in database
app.get('/getData',(req,res)=>{                 
    const db = Dbservice.getSingleInstance();
    const sheetData = getSheetData();

    sheetData
    .then(data=>{
        const sendData = db.createContact(data);
        sendData
        .then(d => {
            const result = db.getAllData();
            result
            .then((data) => {
                res.json({
                    data:data
                });
                
            }).catch((err) => {
                console.log('Error in /getData');
                console.log(err);
            });
            })
            .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log('Error in getting sheet data');
    })
})


// This endpoint is used to retrieve complete details of the employee from the database
app.post('/completeDetails/:id',(req,res)=>{
    const id = req.params.id;
    const db = Dbservice.getSingleInstance();
    const result = db.getCompleteDetails(id);
    result
    .then(
        data =>{
            console.log('details ', data);
            res.json({
                data:data
            })
        }
    )
    .catch(err=>{
        console.log('Error in post completeDetails');
    })
})


// This endpoint was used to get authorization code for google api OAuth 2.0
// app.get('/oauth', (req, res) => {
//     const authorizationCode = req.query.code;
//     const state = req.query.state;
  
//     console.log(authorizationCode);
//     console.log(state);
//     res.send('success');
//   });


// UPDATE

// delete
// This endpoint recieves id of the employee to be deleted and handles deletion.
app.delete('/delete/:id',(req,res)=>{
    console.log(req.params);
    const id = req.params.id;
    const db = Dbservice.getSingleInstance();
    const result = db.deleteRow(id);
    result 
    .then(data => res.json({
        success : data
    }))
    .catch(err=>console.log('Error in post delete : ', err));
})


// edit
// This endpoint is used to update the name of existing employee, can be implemented to update other fields as well
app.patch('/update',(req,res)=>{
    const {name, id} = req.body;
    console.log(req.body);
    const db = Dbservice.getSingleInstance();
    const result = db.editName(id,name);
    result 
    .then(data => {
        console.log(data);
        res.json({
            success : data
        })
    }
    )
    .catch(err=>console.log('Error in patch edit : ', err));
})



// server
app.listen(env.PORT,env.HOST, ()=>{
    console.log(`App is running at http://${env.HOST}:${env.PORT}`);
})