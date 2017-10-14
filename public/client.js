
$(document).ready(function() {
    $('#register-link').on('click', showRegisterFn);
    $('#sign-in-button').on('click', signInFn);
    //To Do: validate values from inputs username and password to sign in
    //To Do: validate values from the register form to register
    $('#register-button').on('click', registerFn);
    $('#form-button').on('click',showFormFn);
    $('#invoices').DataTable();
    
})
const catchAllError = err => {
        if (err.status === 401) {
          window.location = '/login.html';
        }
      };
function registerFn() {
    let username = $('#register-username').val();
    let password = $('#register-password').val();
    let company = $('#name').val();
    let phone = $('#phone').val();
    //let address = {street : $('#street').val(), }
    let registerData = {username: username, password: password, company: company, phone: phone};
    console.log (registerData);
    // validate inputs
    // no empty inputs
    // phone must be number in phone format
    // string fields must be string : name, street address, city
    // make state to be a drop down
    // zipcode must be zipcode
    //username must be a string
    // password must be at least 10 characters
    $.ajax ({
        url: '/api/users/register',
        method: 'POST',
        data: JSON.stringify(registerData),
        dataType: 'json',
        contentType:'application/json; charset=utf-8',
        success: function(data) {
            console.log(data);
            console.log('user created successfully');
            $('#register-form').empty();
            $('#register-section').addClass('hidden');
            $('#sign-in-section').removeClass('hidden');
            $('#demo').append(`<span>Your account is registered, please sign in.</span>`)
            $('#demo').removeClass('hidden');
        },
        error: catchAllError
    })
}
//sign in function
function signInFn() {
    let username = $('#sign-in-username').val();
    let password = $('#sign-in-password').val();
    let userData ={ username: username, password: password};
    $.ajax({
        url: '/api/auth/login',
        method: 'GET',
        data: JSON.stringify(userData),
        dataType: 'json',
        headers:  { 'Authorization': 'Basic ' + window.btoa(userData.username + ':' + userData.password) },
        success: function(token){
            console.log(token);
            console.log('user is authenticated');
            //showDashBoardFn();
        },
        error: catchAllError
    })
}

function showFormFn() {
    $('#create-form').removeClass('hidden');
}

function showRegisterFn() {
    $('#sign-in-section').addClass('hidden');
    $('#demo').addClass('hidden');
    $('#register-section').removeClass('hidden');
}

/* function showDashBoardFn(){
    $.ajax({
        url:
    })
} */