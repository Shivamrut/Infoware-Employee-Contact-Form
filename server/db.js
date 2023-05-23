// Create null instance for initial Dbservice class object
let instance = null;           

const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "maxusredmysql",
    database: 'Employee',
    insecureAuth: true
});


con.connect(function (err) {
    if (err) console.log(err);
    else console.log("DB Connected!");

});


// Using OOPs based techniques to handle queries
class Dbservice {
    // This method makes sure there is only one instance on this class everywhere
    static getSingleInstance() {
        return instance ? instance : new Dbservice();

    }

    // This method retreives required data field for the employee table
    async getAllData() {
        try {
            const response = await new Promise((resolve, rej) => {
                const query =
                    ` SELECT 
                                d.id,
                                d.full_name,
                                d.job_title,
                                c.phone_number,
                                d.email
                                FROM 
                                details d
                                JOIN 
                                contact c ON d.id = c.employee_id;  `;

                con.query(query, (err, results) => {
                    if (err) {
                        rej(new Error(err.message));
                    }
                    else {
                        resolve(results);
                    }
                })
            })
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }

    // This method is used to create employee and add details in all three tables
    async createContact(data) {
        // data is an array of js objects
        try {
            const response = await new Promise((resolve, reject) => {
                data.forEach(async (item) => {
                    const { employee_full_name,
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
                        timestamp } = item;

                    // Check if a duplicate is present by comparing timestamps. Prevents repeated data generation of already existing data from the spreadsheet
                    const duplicate = await this.checkDuplicate(timestamp); 
                    // If not a duplicate it return true

                    if (duplicate) {
                        // First add details to details table
                        let id;
                        let query = `INSERT INTO details (full_name, job_title, email, address, city, state,time_stamp)
                            VALUES (?,?,?,?,?,?,?);`
                        await con.query(query, [employee_full_name, job_title, email, address, city, state, timestamp], (err, result) => {
                            if (err) {
                                console.log(err);
                                reject(new Error(err.message));
                            }
                            else {

                                // If no error found in details table add data to contact and emergencyContact table

                                id = result.insertId;
                                query = `INSERT INTO contact (employee_id, phone_number)VALUES (?, ?);`

                                con.query(query, [id, phone_number], (err, result) => {

                                    if (err) {
                                        console.log('Error in contacts');
                                        console.log(err);
                                        reject(new Error(err.message));
                                    }
                                    else {
                                        console.log('Added to contacts');
                                    }
                                })

                                query = `INSERT INTO emergencyContact (employee_id, name, phone_number, relationship, priority) VALUES (?,?,?,?,1), (?,?,?,?,2);`

                                con.query(query, [id, primary_emergency_contact, primary_emergency_phone_number, primary_emergency_relationship, id, secondary_emergency_contact, secondary_emergency_phone_number, secondary_emergency_relationship], (err, result) => {
                                    if (err) {
                                        console.log('Error in emergencyContacts');
                                        console.log(err);
                                        reject(new Error(err.message));
                                    }
                                    else {
                                        console.log('Added to emergencyContacts');
                                    }
                                })
                            }
                        })
                    }

                })
                resolve('Successfully added contact');
            })

            return response;

        } catch (err) {
            console.log(err);
        }

    }

    // This method implements the code to check if a duplicate data is being added by comparing the timestamps
    async checkDuplicate(stamp) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT id FROM details WHERE time_stamp = ?';
                con.query(query, [stamp], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(result);
                    }
                });
            });

            if (response.length > 0) {
                return false; // Duplicate exists
            } else {
                return true; // No duplicate
            }
        }
        catch (err) {
            console.log('Error deleting row: ', err);
            return false;
        }
    }

    // This method implements code to delete the data from all three tables
    // First contact table data is deleted
    // Then emergencyContact table data is deleted 
    // Finally Details table data is deleted so that there is no foreign key dependency error
    async deleteRow(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'delete from contact where employee_id =?';
                con.query(query, [id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    else {
                        resolve(result.affectedRows);
                    }
                })
            })
            if (response === 1) {
                this.deleteEmergencyContact(id);
                return true;
            }
            else {
                return false;
            }
        }
        catch (err) {
            console.log('Error deleting row: ', err);
            return false;
        }
    }

    // This method deletes data from emergencyContact table
    async deleteEmergencyContact(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'delete from emergencyContact where employee_id=?';
                con.query(query, [id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    else {
                        resolve(result.affectedRows);
                    }
                })
            })
            if (response >= 1) {
                this.deleteDetails(id); 
            }
            else {
                return false;
            }
        }
        catch (err) {
            console.log('Error deleting row: ', err);
            return false;
        }
    }

    // This method deletes data from details table
    async deleteDetails(id) {
        try {
            // console.log('delete id: ',id);
            const response = await new Promise((resolve, reject) => {
                const query = 'delete from details where id=?';
                con.query(query, [id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    else {

                        resolve('Deleted Details Table Data');
                    }
                })
            })
            return response;
        }
        catch (err) {
            console.log('Error deleting row: ', err);
            return false;
        }
    }

    // This method implements code to update name of existing employee
    // This method can be changed according to needs of updating the required field
    async editName(id, name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'update details set full_name = ? where id = ?';
                con.query(query, [name, id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    else {
                        resolve(result.affectedRows);
                    }
                })
            })
            return response === 1 ? true : false;

        }
        catch (err) {
            console.log('Error in editName db: ', err);
        }
    }

    // This method retrieves complete details of the employee whose id is provided
    async getCompleteDetails(id) {
        try {
            const response = await new Promise((resolve, reject) => {
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

                con.query(query, [id], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    else {
                        resolve(result);
                    }
                })
            })
            return response;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}


// Exporting this class so that it can be used across different files
module.exports = Dbservice;