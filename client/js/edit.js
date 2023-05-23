const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');
const getBtn = document.getElementById('get-btn');


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
        deleteRow(idVal);
    }

})
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
                updateName(idVal, nameVal);

            }
        })
    }
})
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
        fullDetails(idVal);
    }


})



function deleteRow(id) {
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

function updateName(id, name) {
    const obj = {
        id: id,
        name: name
    };
    console.log(obj);
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

function fullDetails(id) {
    fetch(`http://127.0.0.1:3000/completeDetails/${id}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(data => displayGetDetails(data['data']))
        .catch(err => {
            console.log('Error in fullDetails()');
        })
}

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
    console.log(data[0]);
}