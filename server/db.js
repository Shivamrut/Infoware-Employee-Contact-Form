let instance = null;

const mysql = require('mysql');
    
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "maxusredmysql",
    database: 'Employee',
    insecureAuth : true
});


con.connect(function(err) {
    if (err) console.log(err);
    else console.log("DB Connected!");
    
});

class Dbservice {
    static getSingleInstance()
    {
        return instance ? instance : new Dbservice();

    }
    async getAllData(){
        try{
            const response = await new Promise((resolve,rej)=>{
                // for a complete data retrieval 
                const query = ` SELECT 
                                d.id,
                                d.full_name,
                                d.job_title,
                                c.phone_number,
                                d.email
                                FROM 
                                details d
                                JOIN 
                                contact c ON d.id = c.employee_id;  `; 
                con.query(query,(err,results)=>{
                    // console.log("result: ",results);
                    if(err){
                        rej(new Error(err.message));
                    }
                    else resolve(results);
                })
            })
            // console.log(response);
            return response;
        }
        catch(err){
            console.log(err);
        }
    }
    async insertNewName(name)
    {
        try{
            const dateAdded = new Date();
            

            const insertId = await new Promise((resolve,rej)=>{
                const query = "insert into miniproj.data(name,date_added) values (?, ?)";
                con.query(query,[name,dateAdded],(err,results)=>{
                    if(err){
                        rej(new Error(err.message));
                    }
                    else resolve(results.insertId);
                    // console.log('result: ',results);
                    // console.log('insertId',results.insertId);
                })
            })
            
            return {
                id: insertId,
                name : name,
                dateAdded: dateAdded
            };
        }
        catch(err)
        {
            console.log(err);
        }
    }
    async deleteRow(id)
    {
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = 'delete from miniproj.data where id=?';
                con.query(query,[id],(err,result)=>{
                    if(err){
                        reject(new Error(err.message));
                    }
                    else{
                        resolve(result.affectedRows);
                    }
                })
            })
            return response ===1 ? true : false;
        }
        catch(err)
        {
            console.log('Error deleting row: ', err);
            return false;
        }
    }
    async editName(id,name){
        try
        {
            const response = await new Promise((resolve,reject)=>{
                const query = 'update miniproj.data set name = ? where id = ?';
                con.query(query,[name,id],(err,result)=>{
                    if(err){
                        reject(new Error(err.message));
                    }
                    else{
                        resolve(result.affectedRows);
                    }
                })
            })
            return response ===1 ? true : false;

        }
        catch(err)
        {
            console.log('Error in editName db: ', err);
        }
    }
    async searchName(name)
    {
        try
        {
            const response = await new Promise((resolve,reject)=>{
                const query = 'select * from miniproj.data where name LIKE ?';
                con.query(query,[`%${name}%`],(err,result)=>{
                    if(err){
                        reject(new Error(err.message));
                    }
                    else{
                        resolve(result);
                    }
                })
            })
            return response;
        }
        catch(err)
        {
            console.log(err);
            return false;
        }
    }
}

module.exports = Dbservice;