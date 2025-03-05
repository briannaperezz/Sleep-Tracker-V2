// creating a variable for the form
const sleepForm = document.getElementById("sleepForm")


const sleepLogTableBody = document.getElementById('sleepLog')

const BASE_URL = 'http://localhost:3000'; // address for our server from the backend



document.addEventListener('DOMContentLoaded', getAllEntries);
//DOMContentLoaded means everytime page is refreshed/accessed
// so everyimt page is accessed/refreshed, getAllEntries function runs, so that data is displayed each time


// retrive all the entries from the MYSQL DB
function getAllEntries() {
    console.log("Page loaded !@!!!");
    // get api 
    fetch(`${BASE_URL}/entries`)
        // "response" is the data the fetch statement is retrieving
        // convert the data to json so front end can read it
        .then(response => {
            console.log("response from entries", typeof response);
            return response.json()
        })
        // putting json converted data into table function which we will define later
        .then((refinedResponse) => {
            renderTable(refinedResponse);
        })
        .catch(error => {
            console.error("Error fetching the entries:", error)
        })
}


// submit handler
sleepForm.addEventListener("submit", (event) => {
    // "submit" is an event listener that listens for when for is submitted
    event.preventDefault();// prevents the page from reloading

    const dateInput = document.getElementById('date').value;
    const hoursInput = document.getElementById('hours').value;

    if (!dateInput || !hoursInput) {
        alert("Please fill in all fields")
        return;
    }

    const newEntry = {
        date: dateInput,
        hours: parseInt(hoursInput)
    }


    fetch(`${BASE_URL}/entries`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
    })
    .then(response => {
        console.log(response, "response !!!!");
        if(!response.ok){
            throw new Error("Error adding entry")
        }
        return response.json();
    })
    .then(data => {
        // after adding a new entry, refetch and re-render the table
        getAllEntries();
        // Reset the from
        sleepForm.reset()
    })
    // if earlier fetch fails, then this error message will appear
    .catch(error => {
        console.error("error adding entry: ", error)
    })
   
})


// 3rd step: render the table with fetched data

function renderTable(entries){
    // resets the inner html from "sleepLog" to empty
    sleepLogTableBody.innerHTML = "";

    entries.forEach((entry) => {
        const row = document.createElement('tr');

        // ID cell
        const idCell = document.createElement('td');
        idCell.textContent = entry.id;

        // date cell
        const dateCell = document.createElement('td')
        dateCell.textContent = entry.date

        // Hours cell
        const hoursCell = document.createElement('td')
        dateCell.textContent = entry.hours


        // Delete Cell
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement("button");

        deleteButton.addEventListener("click", () => {
            // deleteEntry(entry.id);
        });
        deleteCell.appendChild(deleteButton);


        // append cells to the row
        row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(hoursCell);
        row.appendChild(deleteCell);


        // append row to the table body
        sleepLogTableBody.appendChild(row);
    })
}

// deleting an entry

