// Confirm script is loaded
console.log("Script loaded!");

// Show intake form for either dog or monkey
function showForm(animalType) {
    const formContainer = document.getElementById("form-container");

    if (animalType === "dog") {
        formContainer.innerHTML = `
            <h3>Intake New Dog</h3>
            <form id="dogForm">
                Name: <input type="text" id="dogName"><br>
                Breed: <input type="text" id="breed"><br>
                Gender: <input type="text" id="gender"><br>
                Age: <input type="number" id="age"><br>
                Weight: <input type="number" id="weight"><br>
                Acquisition Date: <input type="text" id="acqDate"><br>
                Acquisition Country: <input type="text" id="acqCountry"><br>
                Training Status: <input type="text" id="trainingStatus"><br>
                Reserved: <select id="reserved">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select><br>
                In-Service Country: <input type="text" id="inService"><br><br>
                <button type="button" onclick="submitDog()">Submit Dog</button>
            </form>
        `;
    } else if (animalType === "monkey") {
        formContainer.innerHTML = `
            <h3>Intake New Monkey</h3>
            <form id="monkeyForm">
                Name: <input type="text" id="monkeyName"><br>
                Species: <input type="text" id="species"><br>
                Gender: <input type="text" id="gender"><br>
                Age: <input type="number" id="age"><br>
                Weight: <input type="number" id="weight"><br>
                Tail Length: <input type="number" id="tailLength"><br>
                Height: <input type="number" id="height"><br>
                Body Length: <input type="number" id="bodyLength"><br>
                Acquisition Date: <input type="text" id="acqDate"><br>
                Acquisition Country: <input type="text" id="acqCountry"><br>
                Training Status: <input type="text" id="trainingStatus"><br>
                Reserved: <select id="reserved">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select><br>
                In-Service Country: <input type="text" id="inService"><br><br>
                <button type="button" onclick="submitMonkey()">Submit Monkey</button>
            </form>
        `;
    }
}

// Submit Dog to backend and LocalStorage
function submitDog() {
    const dog = {
        name: getValue("dogName"),
        breed: getValue("breed"),
        gender: getValue("gender"),
        age: getValue("age"),
        weight: getValue("weight"),
        acqDate: getValue("acqDate"),
        acqCountry: getValue("acqCountry"),
        trainingStatus: getValue("trainingStatus"),
        reserved: getValue("reserved"),
        inService: getValue("inService")
    };

    saveAnimalToLocal("dog", dog);

    fetch("http://localhost:3000/dogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dog)
    });

    document.getElementById("output").innerHTML =
        `<p><strong>Dog Submitted:</strong> ${Object.values(dog).join(" | ")}</p>`;

    document.getElementById("dogForm").reset();
}

// Submit Monkey to backend and LocalStorage
function submitMonkey() {
    const monkey = {
        name: getValue("monkeyName"),
        species: getValue("species"),
        gender: getValue("gender"),
        age: getValue("age"),
        weight: getValue("weight"),
        tailLength: getValue("tailLength"),
        height: getValue("height"),
        bodyLength: getValue("bodyLength"),
        acqDate: getValue("acqDate"),
        acqCountry: getValue("acqCountry"),
        trainingStatus: getValue("trainingStatus"),
        reserved: getValue("reserved"),
        inService: getValue("inService")
    };

    saveAnimalToLocal("monkey", monkey);

    fetch("http://localhost:3000/monkeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(monkey)
    });

    document.getElementById("output").innerHTML =
        `<p><strong>Monkey Submitted:</strong> ${Object.values(monkey).join(" | ")}</p>`;

    document.getElementById("monkeyForm").reset();
}

// Print Animals
function printAnimals(type) {
    const output = document.getElementById("output");

    if (type === "dog" || type === "monkey") {
        fetch(`http://localhost:3000/${type}s`)
            .then(res => res.json())
            .then(data => {
                if (!data.length) {
                    output.innerHTML = `<p>No ${type}s found.</p>`;
                    return;
                }
                output.innerHTML = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)}s:</h3>` +
                    data.map((a, i) => `<p>${i + 1}. ${Object.values(a).join(" | ")}</p>`).join("");
            })
            .catch(err => {
                console.error("Fetch failed:", err);
                output.innerHTML = `<p>Error loading ${type}s.</p>`;
            });
    } else if (type === "available") {
        const dogs = JSON.parse(localStorage.getItem("dogs")) || [];
        const monkeys = JSON.parse(localStorage.getItem("monkeys")) || [];
        const available = [...dogs, ...monkeys].filter(a => a.reserved === "false");

        output.innerHTML = available.length
            ? "<h3>Unreserved Animals:</h3>" + available.map((a, i) =>
                `<p>${i + 1}. ${Object.values(a).join(" | ")}</p>`).join("")
            : "<p>No unreserved animals available.</p>";
    }
}

// Search
function searchAnimal() {
    document.getElementById("form-container").innerHTML = `
        <h3>Search Animal</h3>
        <input id="searchTerm" placeholder="Enter name or species...">
        <select id="searchType">
            <option value="dog">Dog</option>
            <option value="monkey">Monkey</option>
        </select>
        <button onclick="performSearch()">Search</button>
    `;
}

function performSearch() {
    const term = getValue("searchTerm").toLowerCase();
    const type = getValue("searchType");
    const list = JSON.parse(localStorage.getItem(type + "s")) || [];
    const results = list.filter(a =>
        (a.name && a.name.toLowerCase().includes(term)) ||
        (a.species && a.species.toLowerCase().includes(term))
    );

    document.getElementById("output").innerHTML = results.length
        ? `<h3>Search Results:</h3>` + results.map((a, i) => `<p>${i + 1}. ${Object.values(a).join(" | ")}</p>`).join("")
        : `<p>No matching ${type}s for "${term}".</p>`;
}

// Reserve Logic
function reserveAnimal() {
    document.getElementById("form-container").innerHTML = `
        <h3>Reserve Animal</h3>
        <form id="reserveForm">
            Animal Type:
            <select id="reserveType">
                <option value="dog">Dog</option>
                <option value="monkey">Monkey</option>
            </select><br>
            Name: <input type="text" id="reserveName"><br>
            <button onclick="submitReservation()">Reserve</button>
        </form>
    `;
}

function submitReservation() {
    const type = getValue("reserveType");
    const name = getValue("reserveName").toLowerCase();
    let key = type + "s";
    let list = JSON.parse(localStorage.getItem(key)) || [];

    let found = false;
    list = list.map(animal => {
        if (animal.name.toLowerCase() === name && animal.reserved !== "true") {
            animal.reserved = "true";
            found = true;
        }
        return animal;
    });

    localStorage.setItem(key, JSON.stringify(list));

    document.getElementById("output").innerHTML = found
        ? `<p>${type} "${name}" reserved.</p>`
        : `<p>No unreserved ${type} named "${name}" found.</p>`;
}

// Export animals as JSON
function exportData() {
    const dogs = localStorage.getItem("dogs") || "[]";
    const monkeys = localStorage.getItem("monkeys") || "[]";

    const blob = new Blob([`{"dogs": ${dogs}, "monkeys": ${monkeys}}`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "animals_export.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Utilities
function getValue(id) {
    return document.getElementById(id).value;
}

function saveAnimalToLocal(type, data) {
    const key = type + "s";
    const current = JSON.parse(localStorage.getItem(key)) || [];
    current.push(data);
    localStorage.setItem(key, JSON.stringify(current));
}

//  Import data from selected JSON file and restore to localStorage
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.dogs && Array.isArray(imported.dogs)) {
                localStorage.setItem("dogs", JSON.stringify(imported.dogs));
                // POST each dog to backend
                imported.dogs.forEach(dog => {
                    fetch("http://localhost:3000/dogs", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(dog)
                    });
                });
            }
    
            if (imported.monkeys && Array.isArray(imported.monkeys)) {
                localStorage.setItem("monkeys", JSON.stringify(imported.monkeys));
                // POST each monkey to backend
                imported.monkeys.forEach(monkey => {
                    fetch("http://localhost:3000/monkeys", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(monkey)
                    });
                });
            }
    
            document.getElementById("output").innerHTML = "<p>Imported and uploaded successfully.</p>";
        } catch (err) {
            console.error("Import error:", err);
            alert("Invalid JSON file format.");
        }
    };
}
    
// Clear LocalStorage and refresh display
function clearAllData() {
    if (confirm("Are you sure you want to clear all animal data?")) {
        localStorage.removeItem("dogs");
        localStorage.removeItem("monkeys");
        document.getElementById("output").innerHTML = "<p>All animal data cleared from LocalStorage.</p>";
    }
}

window.clearAllData = clearAllData;
       

// Global Access
window.showForm = showForm;
window.submitDog = submitDog;
window.submitMonkey = submitMonkey;
window.reserveAnimal = reserveAnimal;
window.printAnimals = printAnimals;
window.searchAnimal = searchAnimal;
window.performSearch = performSearch;
window.submitReservation = submitReservation;
window.exportData = exportData;
window.importData = importData;
