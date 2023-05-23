//This file is used to create fake data for sample testing

const faker = require('faker');
const Dbservice = require('./db');

const dataNo = 100;
const db = Dbservice.getSingleInstance();
const data = [];
for (let i = 0; i < dataNo; i++) {

    // Generate fake data 
    const employeeFullName = faker.company.companyName();
    const jobTitle = faker.name.jobTitle();
    const phoneNumber = faker.phone.phoneNumber();
    const email = faker.internet.email();
    const address = faker.address.streetAddress();
    const city = faker.address.city();
    const state = faker.address.state();
    const primaryEmergencyContact = faker.name.findName();
    const primaryEmergencyPhoneNumber = faker.phone.phoneNumber();
    const primaryEmergencyRelationship = faker.random.word();
    const secondaryEmergencyContact = faker.name.findName();
    const secondaryEmergencyPhoneNumber = faker.phone.phoneNumber();
    const secondaryEmergencyRelationship = faker.random.word();
    const timestamp = faker.date.recent().toLocaleString();

    // Create object with fake data
    const employeeData = {
        employee_full_name: employeeFullName,
        job_title: jobTitle,
        phone_number: phoneNumber,
        email: email,
        address: address,
        city: city,
        state: state,
        primary_emergency_contact: primaryEmergencyContact,
        primary_emergency_phone_number: primaryEmergencyPhoneNumber,
        primary_emergency_relationship: primaryEmergencyRelationship,
        secondary_emergency_contact: secondaryEmergencyContact,
        secondary_emergency_phone_number: secondaryEmergencyPhoneNumber,
        secondary_emergency_relationship: secondaryEmergencyRelationship,
        timestamp: timestamp
    };

    // push the object into array
    data.push(employeeData);

}

// Pass the fake data object array as argument to add all fake employees to the database
const result = db.createContact(data);
result
    .then((data) => {
        console.log('success');
        console.log(data);

    }).catch((err) => {
        console.log(err);
    });
