// Get important elements to be handled
const table = document.getElementById('table-body');
const fullTable = document.getElementById('Table');
const showBtn = document.getElementById('show-list-btn');
var data;

// When the page is loaded, retrieve data from the database to inject into table
document.addEventListener('DOMContentLoaded', async function (event) {

  fetch('http://localhost:3000/getData')
    .then(res => res.json())
    .then(Data => {
      generateTable(Data['data']);
      data = Data['data'];
    })
    .catch(err => {
      console.log('Error in Fetching data');
      console.log(err);
    })
});


// When clicked show the hidded table 
showBtn.addEventListener('click', () => {
  Table.style.display = 'block';
})


// Get elements to implement pagination
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const itemsPerPage = 2; // Number of items to display per page
let currentPage = 1;


// Main function that displays the employee list
function generateTable(data, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = data.slice(startIndex, endIndex);
  console.log(itemsToShow);
  if (data.length == 0) {
    table.innerHTML = '<tr><td colspan=5> No data </td></tr>';
    return;
  }
  let tableHtml = '';
  itemsToShow.forEach((item) => {
    tableHtml += '<tr>';
    tableHtml += `<td>${item.id}</td>`;
    tableHtml += `<td>${item.full_name}</td>`;
    tableHtml += `<td>${item.job_title}</td>`;
    tableHtml += `<td>${item.phone_number}</td>`;
    tableHtml += `<td>${item.email}</td>`;
    tableHtml += '</tr>';
  });

  table.innerHTML = tableHtml;
  pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(data.length / itemsPerPage)}`;
}

// Function to handle previous page button click
function goToPrevPage() {
  if (currentPage > 1) {
    currentPage--;
    generateTable(data, currentPage, itemsPerPage);
  }
}

// Function to handle next page button click
function goToNextPage() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    generateTable(data, currentPage, itemsPerPage);
  }
}

// Add event listeners to pagination buttons
prevBtn.addEventListener('click', goToPrevPage);
nextBtn.addEventListener('click', goToNextPage);

