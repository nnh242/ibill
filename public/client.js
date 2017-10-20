
$(document).ready(function() {
    $('#start-button').click(start);
    $('#logo').on('click', logOut);
    $('#register-link').on('click', showRegister);
    $('#sign-in-form').on('submit', loadDashboard, signIn, );
    $('#register-form').on('submit', register);
    $('#form-button').on('click',showForm);
    $('#create-form').on('submit',createInvoice);
    $('#invoices').DataTable();
    $('#back-button').on('click', toDashboard)
    $('#invoices').on('click','#delete-invoice',deleteInvoice);
    $('#invoices').on('click','#edit-invoice', editInvoice);
    $('#invoices').on('click','#view-invoice', viewInvoice);
})
function start() {
    window.location.href= '/login';
}
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
            error: function() {
                $('.headlines').notify('Invalid username or password', 
                { position:"right" })
            }
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
           $.cookie('displayAddress', data.user.address);
            window.location.href= '/dashboard/'+ $.cookie('userId');
        },
        error: function() {
            $('.headlines').notify('Invalid username or password', 
            { position:"right" })
        }
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
                         <td><button type="button" class="primary-button" id="delete-invoice" data-invoiceId="${invoices[index][i].id}" data-invoiceNum="${invoices[index][i].number}" data-customer="${invoices[index][i].customer}" data-item="${invoices[index][i].item}" data-price="${invoices[index][i].price}" data-date="${invoices[index][i].date}">Delete</button></td>
                         <td><button type="button" class="primary-button" id="edit-invoice" data-invoiceId="${invoices[index][i].id}" data-invoiceNum="${invoices[index][i].number}" data-customer="${invoices[index][i].customer}" data-item="${invoices[index][i].item}" data-price="${invoices[index][i].price}" data-date="${invoices[index][i].date}" >Edit</button></td>
                         <td><button type="button" class="primary-button"id="view-invoice" data-invoiceId="${invoices[index][i].id}" data-invoiceNum="${invoices[index][i].number}" data-customer="${invoices[index][i].customer}" data-item="${invoices[index][i].item}" data-price="${invoices[index][i].price}" data-date="${invoices[index][i].date}">View</button></td>
                        </tr>
                    `)
                }
            })
        }
    });
}

function showForm() {
    $('#create-form').removeClass('hidden');
}

function createInvoice(){
    event.preventDefault();
    let customer = $('#customer').val();
    let date = $('#date').val();
    let price = $('#price').val();
    let item = $('#item').val();
    if (customer === '') {
        $('#customer').notify('Please fill out this field', { position:"top right" });
    }
    else if (item === ''){
        $('#item').notify('Please fill out this field', { position:"top right" });
    }
    else if (price === ''){
        $('#price').notify('Please fill out this field', { position:"top right" });
    }
    else {
       let invoiceData = {customer: customer, date: date, price: price, item: item, userId:$.cookie('userId')};
        $.ajax({
            url: '/api/invoices',
            method: 'POST',
            data: JSON.stringify(invoiceData),
            dataType: 'json',
            contentType:'application/json',
            headers: {'Authorization': `Bearer ${storedToken}`},
            success: function (data){
                $('#date,#customer,#price,#item').val('');
                $('#create-form').toggleClass('hidden');
                let date = moment(data.date).format('MM/DD/YY');
                $('.dataTables_empty').hide();
                $('#data-table').prepend(`
                <tr>
                <td>${date}</td>
                <td>${data.number}</td>
                <td>${data.customer}</td>
                <td>${data.item}</td>
                <td>$ ${data.price}</td>
                <td><button type="button" class="primary-button" id="delete-invoice" data-invoiceId="${data.id}" data-invoiceNum="${data.number}" data-customer="${data.customer}" data-item="${data.item}" data-price="${data.price}" data-date="${data.date}">Delete</button></td>
                <td><button type="button" class="primary-button" id="edit-invoice" data-invoiceId="${data.id}" data-invoiceNum="${data.number}" data-customer="${data.customer}" data-item="${data.item}" data-price="${data.price}" data-date="${data.date}">Edit</button></td>
                <td><button type="button" class="primary-button"id="view-invoice" data-invoiceId="${data.id}" data-invoiceNum="${data.number}" data-customer="${data.customer}" data-item="${data.item}" data-price="${data.price}" data-date="${data.date}">View</button></td>
               </tr>
            `);
            },
            error: catchAllError
        })
    }   
}

function deleteInvoice() {
    let invoiceId = $(this).attr('data-invoiceId');
    $.ajax ({
        url: `/api/invoices/${invoiceId}`,
        method:'DELETE',
        data: invoiceId,
        dataType: 'json',
        headers: {'Authorization': `Bearer ${storedToken}`},
        success: function removeInvoice(){
            $(this).parents(3).remove();
        },
        error: catchAllError
    })
}

function editInvoice(){
    $('.dataTables_empty').hide();
    let invoiceId = $(this).attr('data-invoiceId');
    let invoiceNum = $(this).attr('data-invoiceNum');
    let thisCustomer = $(this).attr('data-customer');
    let thisItem = $(this).attr('data-item');
    let thisPrice = $(this).attr('data-price');
    let thisDate = $(this).attr('data-date');
    let useDate = moment.parseZone(thisDate).utc().format();
     $('#customer').val(thisCustomer);
    $('#date').val(useDate);
    $('#price').val(thisPrice);
    $('#item').val(thisItem);
    $('#save-button').replaceWith(`<button type="button" class="primary-button" id="update-button">Update</button>`)
    $('#create-form').show();
    $('#update-button').on('click', function (){
        let updateData = {id: invoiceId, customer: thisCustomer, date: thisDate, price: thisPrice, item: thisItem, userId:$.cookie('userId')};
        $.ajax({
            url: `/api/invoices/${invoiceId}`,
            method: 'PUT',
            data: JSON.stringify(updateData),
            dataType: 'json',
            contentType:'application/json',
            headers: {'Authorization': `Bearer ${storedToken}`},
            success: function(data){
                $('#date,#customer,#price,#item').val('');
                $('#create-form').toggleClass('hidden');
            },
            error: catchAllError
        })
    })
}

function viewInvoice(name){
    let invoiceId = $(this).attr('data-invoiceId');
    let invoiceNum = $(this).attr('data-invoiceNum');
    let thisCustomer = $(this).attr('data-customer');
    let thisItem = $(this).attr('data-item');
    let thisPrice = $(this).attr('data-price');
    window.location.href= '/preview/'+ invoiceId;
    $(window).on('load',function () {
        $(".company-name").text(`${name}`);
        $(".invoice-number").text(`${invoiceNum}`); 
    });
}
function logOut(){
    window.location.href= '/'
}
function toDashboard(){
    window.location.href= '/dashboard/'+ $.cookie('userId');
}