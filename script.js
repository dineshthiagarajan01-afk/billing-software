// ---------------- INVENTORY DATA ----------------
const itemsData = {
"Filters & Oils": ["Oil Filter","Air Filter","Fuel Filter","Cabin / AC Filter","Engine Oil","Brake Oil","Gear Oil","Coolant"],
"Engine & Transmission": ["Clutch Plate","Pressure Plate","Release Bearing","Flywheel","Timing Belt","Timing Chain","Alternator Belt","Water Pump","Radiator","Turbocharger","Fuel Injector","Fuel Pump Assembly","Engine Gasket Kit","Head Gasket"],
"Braking System": ["Brake Pads","Brake Shoes","Brake Disc / Rotor","Brake Drum"],
"Suspension & Steering": ["Shock Absorbers","Control Arms","Tie Rod End","Steering Rack","Ball Joint","Wheel Bearing","CV Joint","Axle Shaft"],
"Electrical & Sensors": ["Battery","Starter Motor","Alternator","Ignition Coil","ABS Sensor","Oxygen Sensor","MAP / MAF Sensor","Crank Position Sensor","Power Window Motor"],
"Body & Lighting": ["Headlight Assembly","Tail Light Assembly","Fog Lamp","Side Mirror","Front Bumper","Rear Bumper","Fender","Door Handle","Windshield Glass"],
"AC & Heating": ["AC Compressor","AC Condenser","Cooling Coil","Expansion Valve","Blower Motor","Heater Core"]
};

// ---------------- BILL ITEMS ----------------
let billItems = [];

// ---------------- LOAD CATEGORIES ----------------
document.addEventListener("DOMContentLoaded", () => {

const category = document.getElementById("category");

if(category){
for(let cat in itemsData){
let option = document.createElement("option");
option.value = cat;
option.textContent = cat;
category.appendChild(option);
}
}

});

// ---------------- LOAD ITEMS ----------------
function loadItems(){

const category = document.getElementById("category").value;
const itemSelect = document.getElementById("itemSelect");

itemSelect.innerHTML = '<option value="">Select Item</option>';

if(!itemsData[category]) return;

itemsData[category].forEach(item=>{
let option = document.createElement("option");
option.value = item;
option.textContent = item;
itemSelect.appendChild(option);
});

}

// ---------------- AUTO FILL ITEM ----------------
function fillSelectedItem(){

const item = document.getElementById("itemSelect").value;

if(item){
document.getElementById("itemInput").value = item;
}

}

// ---------------- ADD ITEM ----------------
function addItem(){

const item = document.getElementById("itemInput").value.trim();
const qty = parseInt(document.getElementById("qty").value);
const price = parseFloat(document.getElementById("price").value);

if(!item || !qty || !price){
alert("Enter item, qty and price");
return;
}

billItems.push({item,qty,price});

document.getElementById("itemInput").value="";
document.getElementById("price").value="";
document.getElementById("qty").value=1;

renderTable();

}

// ---------------- RENDER TABLE ----------------
function renderTable(){

const tbody = document.querySelector("#billTable tbody");

if(!tbody) return;

tbody.innerHTML="";

billItems.forEach((data,index)=>{

const total = data.qty * data.price;

tbody.innerHTML += `
<tr>
<td>${data.item}</td>
<td>${data.qty}</td>
<td>${data.price}</td>
<td>${total}</td>
<td><button onclick="removeItem(${index})">X</button></td>
</tr>
`;

});

calculateTotal();

}

// ---------------- REMOVE ITEM ----------------
function removeItem(index){

billItems.splice(index,1);
renderTable();

}

// ---------------- CALCULATE TOTAL ----------------
function calculateTotal(){

let subtotal = 0;

billItems.forEach(item=>{
subtotal += item.qty * item.price;
});

document.getElementById("subtotal").innerText = subtotal;

let labour = parseFloat(document.getElementById("labour").value) || 0;
let discount = parseFloat(document.getElementById("discount").value) || 0;

let grandTotal = subtotal + labour - discount;

document.getElementById("grandTotal").innerText = grandTotal;

}

// ---------------- SAVE BILL ----------------
function saveBill(){

if(billItems.length===0){
alert("Add items first");
return;
}

let allBills = JSON.parse(localStorage.getItem("allBills")) || [];

const bill = {

billNo: allBills.length + 1,
date: new Date().toLocaleDateString(),

customer: document.getElementById("customerName").value,
phone: document.getElementById("phone").value,
vehicle: document.getElementById("vehicleNo").value,

items: JSON.parse(JSON.stringify(billItems)),

labour: document.getElementById("labour").value,
discount: document.getElementById("discount").value,

total: document.getElementById("grandTotal").innerText

};

allBills.push(bill);

localStorage.setItem("allBills",JSON.stringify(allBills));

alert("Bill Saved");

billItems=[];
renderTable();

}

// ---------------- PRINT CURRENT BILL ----------------
function printInvoice(){

let bill = {
billNo: generateInvoiceNumber(),
date:new Date().toLocaleDateString(),
customer:document.getElementById("customerName").value,
phone:document.getElementById("phone").value,
vehicle:document.getElementById("vehicleNo").value,
items:billItems,
labour:document.getElementById("labour").value,
discount:document.getElementById("discount").value
};

printInvoiceTemplate(bill);

}
// ---------------- DOWNLOAD CURRENT BILL ----------------
function downloadPDF(){

let bill = {
billNo:"TEMP",
date:new Date().toLocaleDateString(),
customer:document.getElementById("customerName").value,
phone:document.getElementById("phone").value,
vehicle:document.getElementById("vehicleNo").value,
items:billItems,
labour:document.getElementById("labour").value,
discount:document.getElementById("discount").value
};

downloadInvoiceTemplate(bill);

}

// ---------------- HISTORY PAGE ----------------
function loadHistoryPage(){

const bills = JSON.parse(localStorage.getItem("allBills")) || [];

const tbody = document.querySelector("#historyTable tbody");

if(!tbody) return;

tbody.innerHTML="";

bills.forEach((bill,index)=>{

tbody.innerHTML+=`
<tr>
<td>${bill.billNo}</td>
<td>${bill.date}</td>
<td>${bill.customer}</td>
<td>Rs ${bill.total}</td>
<td>
<button onclick="viewInvoiceTemplate(${index})">View</button>
<button onclick="downloadOldInvoice(${index})">Download</button>
<button onclick="deleteBill(${index})">Delete</button>
</td>
</tr>
`;
});

}

// ---------------- NAVIGATION ----------------
function goToHistory(){window.location.href="history.html";}
function goBack(){window.location.href="index.html";}

// ---------------- GLOBAL FUNCTIONS ----------------
window.addItem=addItem;
window.removeItem=removeItem;
window.saveBill=saveBill;
window.printInvoice=printInvoice;
window.downloadPDF=downloadPDF;
window.loadHistoryPage=loadHistoryPage;
window.goToHistory=goToHistory;
window.goBack=goBack;
function filterBills(){

const search = document.getElementById("searchPhone").value.toLowerCase();

const bills = JSON.parse(localStorage.getItem("allBills")) || [];

const tbody = document.querySelector("#historyTable tbody");

tbody.innerHTML = "";

const filtered = bills.filter(bill =>
(bill.phone && bill.phone.toLowerCase().includes(search)) ||
(bill.customer && bill.customer.toLowerCase().includes(search)) ||
(bill.vehicle && bill.vehicle.toLowerCase().includes(search))
);

if(filtered.length === 0){
tbody.innerHTML = "<tr><td colspan='5'>No Bills Found</td></tr>";
return;
}

filtered.forEach((bill,index)=>{

const originalIndex = bills.findIndex(b => b.billNo === bill.billNo);

tbody.innerHTML += `
<tr>
<td>${bill.billNo}</td>
<td>${bill.date}</td>
<td>${bill.customer}</td>
<td>Rs ${bill.total}</td>
<td>
<button onclick="viewInvoiceTemplate(${originalIndex})">View</button>
<button onclick="downloadOldInvoice(${originalIndex})">Download</button>
</td>
</tr>
`;

});

}
window.printInvoiceTemplate = printInvoiceTemplate;
window.downloadInvoiceTemplate = downloadInvoiceTemplate;
window.viewInvoiceTemplate = viewInvoiceTemplate;
window.downloadOldInvoice = downloadOldInvoice;

function generateInvoiceNumber(){

let lastNumber = localStorage.getItem("lastInvoiceNumber");

if(!lastNumber){
lastNumber = 0;
}

lastNumber = Number(lastNumber) + 1;

localStorage.setItem("lastInvoiceNumber", lastNumber);

let formatted = "INV-" + String(lastNumber).padStart(4,"0");

return formatted;

}
function deleteBill(index){

let confirmDelete = confirm("Delete this bill permanently?");

if(!confirmDelete) return;

let bills = JSON.parse(localStorage.getItem("allBills")) || [];

bills.splice(index,1);

localStorage.setItem("allBills", JSON.stringify(bills));

loadHistoryPage();

}