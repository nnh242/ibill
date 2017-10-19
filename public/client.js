
$(document).ready(function() {
    $('#register-link').on('click', showRegister);
    $('#sign-in-form').on('submit', loadDashboard, signIn, );
    $('#register-form').on('submit', register);
    $('#form-button').on('click',showForm);
    $('#create-form').on('submit',createInvoice);
    $('#invoices').DataTable();
})

function showRegister() {
    $('#sign-in-section').addClass('hidden');
    $('#demo').addClass('hidden');
    $('#register-section').removeClass('hidden');
}

const catchAllError = err => {
        if (err.status === 401) {
          alert('invalid ajax');
        }
      };

function register() {
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
        $.ajax ({
            url: '/api/users/register',
            method: 'POST',
            data: JSON.stringify(registerData),
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            success: function(data) {
                $('#register-form').empty();
                $('#register-section').addClass('hidden');
                $('#sign-in-section').removeClass('hidden');
                $('#login-footer').replaceWith(`<h4>Thank you for registering, please sign in!</h4>`);
            },
            error: catchAllError
        })
    }
   
}

function signIn() {
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
           $.cookie('token', data.authToken);
           $.cookie('userId', data.user._id);
           $.cookie('displayName', data.user.company);
            window.location.href= '/dashboard/'+ $.cookie('userId') ;
            
        },
        error: catchAllError
       /*  error: {
            stop alert, highlight the invalid input box, notify Invalid username or password
        } */
    })  
    }
}

const storedToken = $.cookie('token');
const currentUserId = $.cookie('userId');
const name = $.cookie('displayName');

loadDashboard(storedToken,currentUserId,name);

function loadDashboard() {
    $('#company-name').replaceWith(`<h4 id="company-name">${name}<h4>`)
    $.ajax ({
        url: '/api/invoices',
        method: 'GET',
        data: currentUserId,
        dataType: 'json',
        headers:  {'Authorization': `Bearer ${storedToken}`},
        success: function(invoices) {
            $.each(invoices, function loadInvoice(index){
                for (let i=0; i< invoices[index].length; i++) {
                    let invoiceDate = moment(invoices[index][i].date).format('MM/DD/YY');
                    $('#data-table').append(`
                        <tr>
                         <td>${invoiceDate}</td>
                         <td>${invoices[index][i].number}</td>
                         <td>${invoices[index][i].customer}</td>
                         <td>${invoices[index][i].item}</td>
                         <td>$ ${invoices[index][i].price}</td>
                         <td><button type="button" class="primary-button" id="delete-invoice">Delete</button></td>
                         <td><button type="button" class="primary-button" id="edit-invioce">Edit</button></td>
                         <td><button type="button" class="primary-button"id="view-invoice">View</button></td>
                        </tr>
                    `)
                }
            })
        },
        error: alert('bad request')
    });
}

function createInvoice(){
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
        $.ajax({
            url: '/api/invoices',
            method: 'POST',
            data: JSON.stringify(invoiceData),
            dataType: 'json',
            contentType:'application/json',
            headers: {'Authorization': `Bearer ${storedToken}`},
            success: function (data){
                $('#create-form').empty();
                $('#create-form').hide();
                //$('#data-table').append()
            },
            error: catchAllError
        })
    }
    
}

//update invoice
    //user clicks on the Edit button, each field in the data table becomes editable, edit button becomes save button
    //user make changes and hit saves
    // invoice is updated
//delete invoice
    //user clicks on delete button, modal pops up 'Are you sure?', No --> Close Modal, Yes--> 

//event: click on View in the Data Table load invoice for preview
//Back to Dashboard -> go back to same dashboard
//log out
function showForm() {
    $('#create-form').removeClass('hidden');
}