
$(document).ready(function() {
    $('#register-link').on('click', showRegisterFn);
    $('#sign-in-form').on('submit', signInFn);
    $('#register-form').on('submit', registerFn);
    $('#form-button').on('click',showFormFn);
    $('#create-form').on('submit',createInvoiceFn);
    $('#invoices').DataTable();
})

function showRegisterFn() {
    $('#sign-in-section').addClass('hidden');
    $('#demo').addClass('hidden');
    $('#register-section').removeClass('hidden');
}

const catchAllError = err => {
        if (err.status === 401) {
          alert('invalid ajax');
        }
      };

function registerFn() {
    event.preventDefault();
    let username = $('#register-username').val();
    let password = $('#register-password').val();
    if (username === '') {
        $('#register-username').notify('Please fill out this field');
    }
    else if (password === ''){
        $('#register-password').notify('Please fill out this field');
    }
    else {
        let company = $('#name').val();
        let phone = $('#phone').val();
        //let address = {street : $('#street').val(), }
        let registerData = {username: username, password: password, company: company, phone: phone};
        console.log (registerData);
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
   
}

function signInFn() {
    event.preventDefault();
    let username = $('#sign-in-username').val();
    let password = $('#sign-in-password').val();
    if (username === '') {
        $('#sign-in-username').notify('Please fill out this field');
    }
    else if (password === '') {
        $('#sign-in-password').notify('Please fill out this field');
    }
    else {
        let userData ={ username: username, password: password};
      $.ajax({
        url: '/api/auth/login',
        method: 'GET',
        data: JSON.stringify(userData),
        dataType: 'json',
        headers:  { 'Authorization': 'Basic ' + window.btoa(userData.username + ':' + userData.password) },
        success: function(data){
            console.log(data);
            console.log('user is authenticated');
           $.cookie('token', data.authToken);
           $.cookie('userId', data.user._id);
           //window.location.href= '/dashboard';
            window.location.href= '/dashboard/'+ $.cookie('userId') ;
        },
        error: catchAllError
    })  
    }
}

const storedToken = $.cookie('token');
function createInvoiceFn(){
    event.preventDefault();
    let number = $('#number').val();
    let customer = $('#customer').val();
    let date = $('#date').val();
    let price = $('#price').val();
    let item = $('#item').val();
    if (customer === '') {
        $('#customer').notify('Please fill out this field', { position:"top right" });
    }
    else if (number === ''){
        $('#number').notify('Please fill out this field', { position:"top right" });
    }
    else if (item === ''){
        $('#item').notify('Please fill out this field', { position:"top right" });
    }
    else if (price === ''){
        $('#price').notify('Please fill out this field', { position:"top right" });
    }
    else {
       let invoiceData = {number: number, customer: customer, date: date, price: price, item: item, userId:$.cookie('userId')};
        debugger
        //invoiceData= $('#create-form').serialize();
        console.log(invoiceData);
        console.log(storedToken);
        $.ajax({
            url: '/api/invoices',
            method: 'POST',
            data: JSON.stringify(invoiceData),
            dataType: 'json',
            contentType:'application/json',
            headers: {'Authorization': `Bearer ${storedToken}`},
            success: function (data){
                console.log(data);
            },
            error: catchAllError
        })
    }
    
}
//get invoice
//update invoice
//delete invoice
//load invoice for preview
//go back to same dashboard
//log out
function showFormFn() {
    $('#create-form').removeClass('hidden');
}