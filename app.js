//mock API in client
const MOCK_INVOICES = {
    "allInvoices" : [
        {
            "id" : "0001",
            "customer": "Lala Doe",
            "description": "HTML update service",
            "price": "30",
            "quantity": "2",
            "date": "2017-09-14"
        },
        {
            "id" : "0002",
            "customer": "Jon Doe",
            "description": "CSS update service",
            "price": "32",
            "quantity": "4",
            "date": "2017-09-15"
        },
        {
            "id" : "0003",
            "customer": "Mimi Doh",
            "description": "CSS update service",
            "price": "31",
            "quantity": "6",
            "date": "2017-09-14"
        }
    ]
}

$(document).ready(function() {
    $('#register-link').on('click',registerFn);
    getInvoices(displayInvoices);

})
function registerFn () {
    $('#sign-in-section').addClass('hidden');
    $('#register-section').removeClass('hidden');
}
//note: only this getInvoices function changes when we have a real API
function getInvoices(callback) {
    setTimeout(function(){callback(MOCK_INVOICES)},100);
}

function displayInvoices (data) {
    for (index in data.allInvoices) {
        let total = data.allInvoices[index].price * data.allInvoices[index].quantity;
        console.log(total);
        $('#invoices').append( 
            '<p>' +'Invoice ID: '+ data.allInvoices[index].id + '<p>' +
            '<p>' + 'Invoice Date:' + data.allInvoices[index].date + '<p>'+
            '<p>' + 'Customer: ' + data.allInvoices[index].customer + '<p>'+ 
            '<p>' + 'Description: '+ data.allInvoices[index].description + '<p>'+ 
            '<p>' + 'Price: $' + data.allInvoices[index].price + '<p>'+ 
            '<p>' + 'Quantity: ' + data.allInvoices[index].quantity + '<p>'+
            '<p>' + 'Total Amount: $' + total + '<p>'
        );
    }
}



