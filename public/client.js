
$(document).ready(function() {
    $('#register-link').on('click', showRegisterFn);
    $('#sign-in-button').on('click', signInFn);
    //To Do: validate values from inputs username and password to sign in
    //To Do: validate values from the register form to register
    $('#register-button').on('click', registerFn);
    $('#form-button').on('click',showFormFn);
    $('#invoices').DataTable();
    
})

function showRegisterFn() {
    $('#sign-in-section').addClass('hidden');
    $('#demo').addClass('hidden');
    $('#register-section').removeClass('hidden');
}

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
            $('#login-footer').replaceWith(`<h4>Thank you for registering, please sign in!</h4>`);
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
        success: function(token, username){
            console.log(token);
            console.log('user is authenticated');
            window.location.href="dashboard.html";
            getUserFn(token, username);
        },
        error: catchAllError
    })
}

function getUserFn(token, username) {
    $.ajax({
        type: 'GET',
        url:'/api/users',
        headers: {'Authorization': 'Bearer' + token},
        success: function(data){
            console.log (token);
            console.log(username);
            console.log(data);
            //let user = id;
            //console.log(user);
            //getInvoiceFn(id,token);
        },
        error: catchAllError
    })    
    //do an ajax to get userid by the username
    //find the invoices for this username
}

 //getInvoiceFn()
    //
    //populate the invoices into the data table  #invoices

function showFormFn() {
    $('#create-form').removeClass('hidden');
}