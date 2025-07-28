
// creating a variable for the form
const sleepForm = document.getElementById("sleepForm")


const sleepLogTableBody = document.getElementById('sleepLog')

const BASE_URL = 'http://localhost:3000'; // address for our server from the backend
// const BASE_URL = 'https://sleep-tracker-v2-backend.onrender.com/'; // address for our server from the backend



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
            updateAverages(refinedResponse)
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
        console.log(entry, "DDDDDD");
        // dateCell.textContent = entry.date
        const parsedDate = new Date(entry.DATE)
        dateCell.textContent = parsedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          });

        // Hours cell
        const hoursCell = document.createElement('td')
        hoursCell.textContent = entry.hours


        // Delete Cell
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete"
        deleteButton.addEventListener('click', () => {
            deleteEntry(entry.id)
        })

        deleteButton.addEventListener("click", () => {
            // deleteEntry(entry.id);
        });
        deleteCell.appendChild(deleteButton);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
            editEntry(entry)

        }
        const editCell = document.createElement('td')
        editCell.appendChild(editBtn)



        // append cells to the row
        // row.appendChild(idCell);
        row.appendChild(dateCell);
        row.appendChild(hoursCell);
        row.appendChild(deleteCell);
        row.appendChild(editCell)

        // append row to the table body
        sleepLogTableBody.prepend(row);
        // sleepLogTableBody.app(row);
    })
}

// deleting an entry
function deleteEntry(id){
    fetch(`${BASE_URL}/entries/${id}`, {
        method: "DELETE"

    })

        .then(response => {
            if(!response.ok){
                throw new Error("Error deleting entry");
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            getAllEntries();
        })
        .catch(error => {
            console.error("Error deleting entry:", error)
        })
}


function calculateAverage(entries, days){
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - days);

    const recentEntries = entries.filter(entry => {
        const entryDate = new Date(entry.DATE);
        return entryDate >= cutoff;
    });

    const totalHours = recentEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
    const average = recentEntries.length > 0 ? (totalHours / recentEntries.length).toFixed(2) : "N/A";

    return average
}

function updateAverages(data){
    document.getElementById('avg7').textContent = calculateAverage(data, 7) + ' hrs';
    document.getElementById('avg14').textContent = calculateAverage(data, 14) + ' hrs';
    document.getElementById('avg30').textContent = calculateAverage(data, 30) + ' hrs';
}



function editEntry(entry){
    const newDate = prompt("Edit Date (MM-DD-YYYY):", new Date(entry.DATE).toISOString().split("T")[0])

    const newHours = prompt("Edit Hours:", entry.hours);

    if(!newDate || isNaN(new Date(newDate) || isNaN(newHours))){
        alert("Invalid date or hours")
        return
    }
    fetch(`${BASE_URL}/entries/${entry.id}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            DATE: newDate,
            Hours: newHours
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(`Entry updated`)
        getAllEntries() // this reloads the sleep logs table
    })
    .catch(err => {
        console.error(`update field`,err)
    })
}