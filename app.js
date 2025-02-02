const sleepForm = document.getElementById("sleepForm")

const sleepLogTableBody = document.getElementById('sleepLog')

const BASE_URL = 'http://localhost:3000';



document.addEventListener('DOMContentLoaded', getAllEntries);


// retrive all the entries from the MYSQL DB
function getAllEntries(){
    // get api 
    fetch(`${BASE_URL}/entries`)
    .then(response => response.json())
    .then(data => {
        renderTable(data);
    })
    .catch(error => {
        console.error("Error fetching the entries:", error)
    })
}



// submit handler
sleepForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const dateInput = document.getElementById('date').value;
    const hoursInput = document.getElementById('hours').value;


    if(!dateInput || !hoursInput){
        alert("Please fill in all fields")
        return;
    }

    const newEntry = {
        date: dateInput,
        hours: parseInt(hoursInput)
    }


    fetch(`${BASE_URL}/entries`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newEntry)
    })
})