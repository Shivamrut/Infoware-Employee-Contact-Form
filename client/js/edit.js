// get the button elements from the page
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');
const getBtn = document.getElementById('get-btn');

// When delete button is clicked
deleteBtn.addEventListener('click', () => {
    const id = document.getElementById('id');
    let idVal = id.value;
    idVal = idVal.trim();
    if (idVal == '') {
        alert('Enter id first');
    }
    else {
        const getBox = document.getElementById('getEmployee');
        getBox.style.display = 'none';
        const updateBox = document.getElementById('updateEmployee');
        updateBox.style.display = 'none';
        // Send id of element to be deleted
        deleteRow(idVal);
    }

})

// When update button is clicked
updateBtn.addEventListener('click', function (event) {

    const id = document.getElementById('id');
    let idVal = id.value;
    idVal = idVal.trim();
    if (idVal == '') {
        alert('Enter id first');
    }
    else {
        const updateBox = document.getElementById('updateEmployee');
        updateBox.style.display = 'initial';
        const getBox = document.getElementById('getEmployee');
        getBox.style.display = 'none';
        const submitBtn = document.getElementById('update-submit-btn');

        submitBtn.addEventListener('click', () => {
            const name = document.getElementById('name');
            let nameVal = name.value;
            nameVal = nameVal.trim();
            if (nameVal == '') {
                alert('Enter new name please');
            }
            else {
                // Send id and new name of the employee to be updated
                updateName(idVal, nameVal);

            }
        })
    }
})

// When get employee details button is clicked
getBtn.addEventListener('click', function (event) {
    const id = document.getElementById('id');
    let idVal = id.value;
    idVal = idVal.trim();
    if (idVal == '') {
        alert('Enter id first');
    }
    else {
        const getBox = document.getElementById('getEmployee');
        getBox.style.display = 'initial';
        const updateBox = document.getElementById('updateEmployee');
        updateBox.style.display = 'none';
        // Send id of the employee whose complete details are to be retrieved
        fullDetails(idVal);
    }


})

// Gives fetch call to the /delete endpoint
function deleteRow(id) {

    // Passing id as request parameter
    fetch(`http://127.0.0.1:3000/delete/${id}`, {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' },

    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert('Delete Successful');
            }
            else {
                alert('Delete Failed');

            }
        })
        .catch('Error in deleteRow');
}

// Gives fetch call to /update endpoint
function updateName(id, name) {

    // Create js object to send request body
    const obj = {
        id: id,
        name: name
    };

    fetch(`http://127.0.0.1:3000/update`, {
        method: "PATCH",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert('Update Successful');
            }
            else {
                alert('Update Failed');

            }
        })
        .catch('Error in updateName');
}

// Fetch call to /completeDetails endpoint

function fullDetails(id) {

    // Passing id as request parameter
    fetch(`http://127.0.0.1:3000/completeDetails/${id}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(data => displayGetDetails(data['data']))
        .catch(err => {
            console.log('Error in fullDetails()');
        })
}


// This function handles the data recieved from backend about the single employee whose complete details are to be known
// Displays data in the form of key value pairs
function displayGetDetails(data) {
    const getBox = document.getElementById('getEmployee');

    const { address, city, email, full_name, id, job_title, phone_number, primary_name, primary_phone, primary_rel, sec_name, sec_phone, sec_rel, state, time_stamp } = data[0];
    getBox.innerHTML = `
    <p>Employee Name:  ${full_name} <br>
    Job Title: ${job_title} <br>
    Email:${email}<br>
    Contact: ${phone_number}<br>
    State: ${state}<br>
    City:${city} <br>
    Primary Emergency Contact:${primary_name} <br>
    Relationship:${primary_rel} <br>
    Phone: ${primary_phone}<br>
    Secondary Emergency Contact:${sec_name} <br>
    Relationship:${sec_rel} <br>
    Phone: ${sec_phone}<br></p>`
}