const MOCK_INVOICES = {
    "allInvoices" : [
        {
            "id" : "0001",
            "customer": "Lala Doe",
            "description": "HTML update service",
            "price": "30.00",
            "quantity": "2",
            "date": "2017-09-14"
        },
        {
            "id" : "0002",
            "customer": "Jon Doe",
            "description": "CSS update service",
            "price": "32.00",
            "quantity": "4",
            "date": "2017-09-15"
        },
        {
            "id" : "0003",
            "customer": "Mimi Doh",
            "description": "CSS update service",
            "price": "31.00",
            "quantity": "6",
            "date": "2017-09-14"
        }
    ]
}

function getInvoices(callback) {
    setTimeout(function(){callback(MOCK_INVOICES)},100);
}

function displayInvoices (data) {
    for (index in data.allInvoices) {
        $('body').append( '<p>' + data.allInvoices[index].text + '<p>');
    }
}

$(document).ready(function (){
    getInvoices(displayInvoices);
});
