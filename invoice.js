function createInvoiceHTML(bill){

let itemsHTML = "";
let total = 0;

bill.items.forEach(item=>{
let rowTotal = item.qty * item.price;
total += rowTotal;

itemsHTML += `
<tr>
<td>${item.item}</td>
<td>${item.qty}</td>
<td>Rs ${item.price}</td>
<td>Rs ${rowTotal}</td>
</tr>`;
});

if(bill.labour){
itemsHTML += `
<tr>
<td>Labour Charges</td>
<td></td>
<td></td>
<td>Rs ${bill.labour}</td>
</tr>`;
total += Number(bill.labour);
}

if(bill.discount){
itemsHTML += `
<tr>
<td>Discount</td>
<td></td>
<td></td>
<td>- Rs ${bill.discount}</td>
</tr>`;
total -= Number(bill.discount);
}

return `

<style>

body{
background:#fefae0;
font-family:Arial;
margin:0;
padding:40px;
}

/* PAGE */

.invoice-page{
width:190mm;
min-height:260mm;
margin:auto;
background:white;
padding:30px;
box-sizing:border-box;
display:flex;
flex-direction:column;
}

/* HEADER */

.invoice-header{
display:flex;
justify-content:space-between;
align-items:flex-start;
margin-bottom:20px;
}

.invoice-title{
font-size:42px;
font-weight:700;
letter-spacing:2px;
color:#6b705c;
}

.invoice-sub{
font-size:12px;
letter-spacing:2px;
margin-top:4px;
color:#777;
}

.invoice-right{
text-align:right;
}

.invoice-logo{
width:60px;
margin-bottom:10px;
}

.invoice-meta p{
margin:2px 0;
font-size:13px;
}

/* CUSTOMER */

.invoice-info{
margin-top:10px;
margin-bottom:20px;
}

.invoice-info p{
margin:3px 0;
font-size:14px;
}

/* TABLE */

.invoice-table{
width:100%;
border-collapse:collapse;
font-size:14px;
}

.invoice-table th{
background:#000;
color:white;
padding:10px;
text-align:left;
}

.invoice-table td{
padding:8px;
border-bottom:1px solid #ddd;
}

/* TOTAL BAR */

.invoice-total{
margin-top:auto;
background:#000;
color:white;
padding:12px 15px;
display:flex;
justify-content:space-between;
font-size:16px;
font-weight:600;
}

/* FOOTER */

.invoice-footer{
display:flex;
justify-content:space-between;
margin-top:15px;
font-size:13px;
}

.invoice-company{
text-align:right;
}

</style>

<div class="invoice-page">

<div class="invoice-header">

<div>
<div class="invoice-title">TARGET</div>
<div class="invoice-sub">MULTIBRAND CAR SERVICE</div>
</div>

<div class="invoice-right">
<img src="logo.png" class="invoice-logo">

<div class="invoice-meta">
<p><b>DATE :</b> ${bill.date}</p>
<p><b>INVOICE NO :</b> ${bill.billNo}</p>
</div>
</div>

</div>

<div class="invoice-info">

<b>BILLED TO:</b>
<p>${bill.customer}</p>
<p>${bill.phone}</p>
<p>${bill.vehicle}</p>

</div>

<table class="invoice-table">

<tr>
<th>DESCRIPTION</th>
<th>QUANTITY</th>
<th>PRICE</th>
<th>TOTAL</th>
</tr>

${itemsHTML}

</table>

<div class="invoice-total">
<span>Grand Total :</span>
<span>Rs ${total}</span>
</div>

<div class="invoice-footer">

<div>THANK YOU FOR CHOOSING US</div>

<div class="invoice-company">
<p>8438143591 - 8925635605</p>
<p>VAIKKAL PATTARI VEERANAM</p>
<p>MAIN ROAD SALEM - 636003</p>
</div>

</div>

</div>
`;

}
function openInvoiceWindow(html){

const win = window.open("", "_blank");

win.document.write(`
<html>
<head>
<title>Invoice</title>
<link rel="stylesheet" href="style.css">
</head>

<body>

${html}

</body>
</html>
`);

win.document.close();

return win;

}

function printInvoiceTemplate(bill){

const html = createInvoiceHTML(bill);

const printWindow = window.open("", "_blank");

printWindow.document.write(`
<html>
<head>
<title>Invoice</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
${html}

<script>
window.onload = function(){
setTimeout(function(){
window.print();
},200);
}
</script>

</body>
</html>
`);

printWindow.document.close();

}
function downloadInvoiceTemplate(bill){

const html = createInvoiceHTML(bill);

const element = document.createElement("div");
element.innerHTML = html;

document.body.appendChild(element);

html2pdf().set({
margin:5,
filename:"Invoice-"+bill.billNo+".pdf",
html2canvas:{
scale:2
},
jsPDF:{
unit:"mm",
format:"a4",
orientation:"portrait"
}
})
.from(element)
.save()
.then(()=>{
document.body.removeChild(element);
});

}


function viewInvoiceTemplate(index){

const bills = JSON.parse(localStorage.getItem("allBills")) || [];

const bill = bills[index];

if(!bill) return;

const html = createInvoiceHTML(bill);

openInvoiceWindow(html);

}

function downloadOldInvoice(index){

const bills = JSON.parse(localStorage.getItem("allBills")) || [];

const bill = bills[index];

if(!bill) return;

downloadInvoiceTemplate(bill);

}

window.printInvoiceTemplate = printInvoiceTemplate;
window.downloadInvoiceTemplate = downloadInvoiceTemplate;
window.viewInvoiceTemplate = viewInvoiceTemplate;
window.downloadOldInvoice = downloadOldInvoice;