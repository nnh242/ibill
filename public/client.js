
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

