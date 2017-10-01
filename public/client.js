
$(document).ready(function() {
    const email = $('#sign-in-email').val();
    const password = $('#sign-in-password').val();
    console.log(email);
    console.log(password);
    $('#register-link').on('click',registerFn);
    $('#sign-in-button').on('submit',signInFn);
    $('#form-button').on('click',showFormFn);
    $('#invoices').DataTable();
})

function showFormFn(){
    $('#create-form').removeClass('hidden');
}

function signInFn() {
    if (email || password == undefined) {
        alert ('please enter valid credentials');
    } 
    else {
        window.location.href = "dashboard.html";
    }
}

function registerFn() {
    $('#sign-in-section').addClass('hidden');
    $('#register-section').removeClass('hidden');
}
