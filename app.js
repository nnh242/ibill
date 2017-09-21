
const email = $('#sign-in-email').val();
const password = $('#sign-in-password').val();

$(document).ready(function() {
    $('#register-link').on('click',registerFn);
    $('#sign-in-button').on('submit',signInFn);
    $('#form-button').on('click',showFormFn);
    getInvoices(displayInvoices);
})

function showFormFn(){
    $('#create-form').removeClass('hidden');
}

function signInFn () {
    if (email || password == undefined) {
        alert ('please enter valid credentials');
    } 
    else {
        window.location.href = "dashboard.html";
    }
}
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



