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
                    else {
                        // console.log(results);
                        resolve(results);
                    }
                })
            })
            // console.log(response);
            return response;
        }
        catch(err){
            console.log(err);
        }
    }
    async createContact(data)
    {
        try
        {
            // console.log('creating contact');
            const response = await new Promise( (resolve,reject)=>{
                // console.log('db  ',data);
                // console.log('name ',employee_full_name);
                data.forEach(async (item)=>{
                    const {employee_full_name,
                            job_title,
                            phone_number,
                            email,
                            address,
                            city,
                            state,
                            primary_emergency_contact,
                            primary_emergency_phone_number,
                            primary_emergency_relationship,
                            secondary_emergency_contact,
                            secondary_emergency_phone_number,
                            secondary_emergency_relationship,
                            timestamp} = item;
                        // console.log('name ',employee_full_name);
                        const duplicate = await this.checkDuplicate(timestamp);
                        
                        
                        if(duplicate){
                            
                        
                            let id;
                            let query = `INSERT INTO details (full_name, job_title, email, address, city, state,time_stamp)
                            VALUES (?,?,?,?,?,?,?);`
                            await con.query(query,[employee_full_name,job_title,email,address,city,state,timestamp],(err,result)=>{
                                if(err){
                                    console.log(err);
                                    reject(new Error(err.message));
                                }
                                else {
                                    // console.log('Added contact to details table');
                                    id = result.insertId;
                                    // console.log(id);
                                    query = `INSERT INTO contact (employee_id, phone_number)VALUES (?, ?);`
                                    
                                    // console.log('id check: ',id);
                                    con.query(query,[id,phone_number],(err,result)=>{

                                            if(err){
                                                console.log('Error in contacts');
                                                console.log(err);
                                                reject(new Error(err.message));
                                            }
                                            else {
                                                // console.log('id check',id);
                                                console.log('Added to contacts');
                                                // console.log(result);
                                            }
                                })

                                query = `INSERT INTO emergencyContact (employee_id, name, phone_number, relationship, priority) VALUES (?,?,?,?,1), (?,?,?,?,2);`

                                con.query(query,[id,primary_emergency_contact,primary_emergency_phone_number,primary_emergency_relationship,id,secondary_emergency_contact,secondary_emergency_phone_number,secondary_emergency_relationship],(err,result)=>{
                                        if(err){
                                            console.log('Error in emergencyContacts');
                                            console.log(err);
                                            reject(new Error(err.message));
                                        }
                                        else {
                                            console.log('Added to emergencyContacts');
                                            // console.log(result);
                                        }
                                    })
                                }
                            })
                        }
                        
                })
                resolve('Successfully added contact');
                

            })
            return response;
        }catch(err)
        {
            console.log(err);
        }

    }
    async checkDuplicate(stamp)
    {
        try {
            const response = await new Promise((resolve, reject) => {
              const query = 'SELECT id FROM details WHERE time_stamp = ?';
              con.query(query, [stamp], (err, result) => {
                if (err) {
                  reject(new Error(err.message));
                } else {
                //   console.log(result);
                  resolve(result);
                }
              });
            });
            
            // console.log('response:', response);
        
            if (response.length > 0) {
              return false; // Duplicate exists
            } else {
              return true; // No duplicate
            }
          } 
        catch(err)
        {
            console.log('Error deleting row: ', err);
            return false;
        }
    }
    async deleteRow(id)
    {
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = 'delete from contact where employee_id =?';
                con.query(query,[id],(err,result)=>{
                    if(err){
                        reject(new Error(err.message));
                    }
                    else{
                        resolve(result.affectedRows);
                    }
                })
            })
            if(response ===1 ){
                this.deleteEmergencyContact(id);
                return true;
            }
            else{
                return false;
            }
            
        }
        catch(err)
        {
            console.log('Error deleting row: ', err);
            return false;
        }
    }
    async deleteEmergencyContact(id)
    {
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = 'delete from emergencyContact where employee_id=?';
                con.query(query,[id],(err,result)=>{
                    if(err){
                        reject(new Error(err.message));
                    }
                    else{
                        resolve(result.affectedRows);
                    }
                })
            })
            if(response >= 1 ){
                this.deleteDetails(id);
            }
            else{
                return false;
            }
        }
        catch(err)
        {
            console.log('Error deleting row: ', err);
            return false;
        }
    }
    async deleteDetails(id)
    {
        try{
            // console.log('delete id: ',id);
            const response = await new Promise((resolve,reject)=>{
                const query = 'delete from details where id=?';
                con.query(query,[id],(err,result)=>{
                    if(err){
                        reject(new Error(err.message));
                    }
                    else{
                        
                        resolve(result.affectedRows);
                    }
                })
            })
            console.log('res :', response==1);
            return response == 1 ;
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
                const query = 'update details set full_name = ? where id = ?';
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

    
    async getCompleteDetails(id)
    {
        try
        {
            const response = await new Promise((resolve,reject)=>{
                const query = 
                `SELECT
                d.id ,
                d.full_name ,
                d.job_title ,
                c.phone_number ,
                d.email ,
                d.address ,
                d.city ,
                d.state ,
                e.name as primary_name,
                e.phone_number as primary_phone,
                e.relationship as primary_rel,
                ec.name as sec_name ,
                ec.phone_number as sec_phone,
                ec.relationship as sec_rel,
                d.time_stamp
                FROM
                details d
                LEFT JOIN
                contact c ON d.id = c.employee_id
                LEFT JOIN
                emergencyContact e ON d.id = e.employee_id AND e.priority = 1
                LEFT JOIN
                emergencyContact ec ON d.id = ec.employee_id AND ec.priority = 2 where d.id=?;`;
                con.query(query,[id],(err,result)=>{
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