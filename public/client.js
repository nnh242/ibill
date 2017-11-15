
$(document).ready(function() {
    $('#start-button').click(start);
    $('#start').click(start);
    $('#logo').on('click', logOut);
    $('#register-link').on('click', showRegister);
    $('#sign-in-form').on('submit', signIn);
    $('#register-form').on('submit', register);
    $('#form-button').on('click',showForm);
    $('#create-form').on('submit',createItem);
    $('#items').DataTable();
    $('#items').on('click','#delete-item',deleteItem);
    $('#items').on('click', '#edit-item',editItem);

})
const t = $('#items').DataTable();;

//redirect users to log-in page
function start() {
    window.location.href= '/login';
}
//hide the log-in form and show the register form
function showRegister() {
    $('.demo').addClass('hidden');
    $('#sign-in-section').addClass('hidden');
    $('#register-section').removeClass('hidden');
}

const catchAllError = err => {
        if (err.status === 401) {
          alert('Bad Request');
        }
      };
// validate and user's username passwordto api/users/register to create new user
function register() {
    event.preventDefault();
    let username = $('#register-username').val();
    let password = $('#register-password').val();
    let company = $('#name').val();
    if (username === '') {
        $('#register-username').notify('Please fill out this field');
    }
    else if (password === ''){
        $('#register-password').notify('Please fill out this field');
    }
    else {
        let registerData = {username: username, password: password, company: company};
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
            error: function(res) {
                if(res.responseJSON.location === 'password'){
                    $('#register-password').notify('Password must have at least 10 characters')
                }
                else if(res.responseJSON.location === 'username'){
                   $('#register-username').notify('Username is already taken')
                } 
            }
        })
    }
}
//post username and password to api/auth/login to exchange for a jwt token to access protected, user-unique dashboard
//access controlled by userID and jwt token
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
        method: 'POST',
        data: JSON.stringify(userData),
        dataType: 'json',
        contentType: 'application/json',
        success: function(data){
           $.cookie('token', data.authToken);
           $.cookie('userId', data.user._id);
           $.cookie('displayName', data.user.company);
           const storedToken = $.cookie('token');
           const currentUserId = $.cookie('userId');
           const name = $.cookie('displayName');
           window.location.href= '/dashboard/' + currentUserId;
           loadDashboard(storedToken,currentUserId,name);
        },
        error: function() {
            event.preventDefault();
            $('.headlines').notify('Invalid username or password', 
            { position:"top" })
        }
    })  
    }
}

const storedToken = $.cookie('token');
const currentUserId = $.cookie('userId');
const name = $.cookie('displayName');
loadDashboard(storedToken,currentUserId,name);
//loadDashboard function is reused for each CRUD ajax request of app
//loading the data table and the company's information
function loadDashboard(storedToken,currentUserId,name) {
    $('#company-name').replaceWith(`<h4 id="company-name">${name}<h4>`)
    $.ajax ({
        url: '/api/items',
        method: 'GET',
        data: currentUserId,
        dataType: 'json',
        cache: false,
        headers:  {'Authorization': `Bearer ${storedToken}`},
        success: function(items) {
            $('#data-table').html('');
            $.each(items, function loadItem(index){
                for (let i=0; i< items[index].length; i++) {
                    t.row.add( [
                        items[index][i].number,
                        items[index][i].customer,
                        items[index][i].item,
                        items[index][i].price,
                        `<button type="button" class="primary-button" id="delete-item" data-itemId="${items[index][i].id}" data-itemsNum="${items[index][i].number}" data-customer="${items[index][i].customer}" data-item="${items[index][i].item}" data-price="${items[index][i].price}" >Delete</button>`,
                        `<button type="button" class="primary-button" id="edit-item" data-itemId="${items[index][i].id}" data-itemsNum="${items[index][i].number}" data-customer="${items[index][i].customer}" data-item="${items[index][i].item}" data-price="${items[index][i].price}">Edit</button>`
                        ] ).draw( false );
                }
            })
        }
    });
}

function showForm() {
    $('#create-form').removeClass('hidden');
}
//this function validates user's inputs and create/display an item to the data table
function createItem(){
    event.preventDefault();
    let number = $('#number').val();
    let customer = $('#customer').val();
    let price = $('#price').val();
    let item = $('#item').val();
    if (customer === '') {
        $('#customer').notify('Please fill out this field', { position:"top right" });
    }
    else if (number === ''){
        $('#number').notify('Please fill out this field', { position:"top right" })
    }
    else if (item === ''){
        $('#item').notify('Please fill out this field', { position:"top right" });
    }
    else if (price === ''){
        $('#price').notify('Please fill out this field', { position:"top right" });
    }
    else {
       let itemsData = {number:number, customer: customer, price: price, item: item, userId:$.cookie('userId')};
       
        $.ajax({
            url: '/api/items',
            method: 'POST',
            data: JSON.stringify(itemsData),
            dataType: 'json',
            contentType:'application/json',
            headers: {'Authorization': `Bearer ${storedToken}`},
            success: function (data){
                $('#number,#customer,#price,#item').val('');
                $('#create-form').toggleClass('hidden');
                $('.dataTables_empty').hide();
                t.row.add( [
                    data.number,
                    data.customer,
                    data.item,
                    data.price,
                    `<button type="button" class="primary-button" id="delete-item" data-itemId="${data.id}" data-itemsNum="${data.number}" data-customer="${data.customer}" data-item="${data.item}" data-price="${data.price}">Delete</button>`,
                    `<button type="button" class="primary-button" id="edit-item" data-itemId="${data.id}" data-itemsNum="${data.number}" data-customer="${data.customer}" data-item="${data.item}" data-price="${data.price}">Edit</button>`
                    ] ).draw( false );
            },
            error: function (message){
                $('#number').notify(message.responseText, {position:"top right"});
            }
        });
    }   
}
// this function deletes an item by id and then update the page
function deleteItem() {
    let itemId = $(this).attr('data-itemId');
    $.ajax ({
        url: `/api/items/${itemId}`,
        method:'DELETE',
        data: itemId,
        dataType: 'json',
        headers: {'Authorization': `Bearer ${storedToken}`},
        success: function removeItem(){
            window.location.reload();
        },
        error: catchAllError
    })
}
//this function allows users to update item by customer, price and item's description
// it loads the current details back up to the form
// after user enters new updated data and hits update, the data table is updated
function editItem(){
    event.preventDefault();
    $('.dataTables_empty').hide();
    let itemId = $(this).attr('data-itemId');
    let thisCustomer = $(this).attr('data-customer');
    let thisItem = $(this).attr('data-item');
    let thisPrice = $(this).attr('data-price');
    let thisNumber=$(this).attr('data-itemsNum');
    $('#number-lable').addClass('hidden');
    $('#number').addClass('hidden')
    $('#customer').val(thisCustomer);
    $('#price').val(thisPrice);
    $('#item').val(thisItem);
    $('#save-button').replaceWith(`<button type="button" class="primary-button" onClick="window.location.reload()" id="update-button">Update</button>`)
    $('#create-form').show();
    $('#update-button').on('click', function (){
        $('#create-form').hide();
        let customer = $('#customer').val();
        let price = $('#price').val();
        let item = $('#item').val();
        if (customer === '') {
            $('#customer').notify('Please fill out this field', { position:"top right" });
        }
        else if (number === ''){
            $('#number').notify('Please fill out this field', { position:"top right" })
        }
        else if (item === ''){
            $('#item').notify('Please fill out this field', { position:"top right" });
        }
        else if (price === ''){
            $('#price').notify('Please fill out this field', { position:"top right" });
        }
        else {
            let updateData={id: itemId, number:thisNumber, customer:customer, price:price, item:item}
            $.ajax({
            url: `/api/items/${itemId}`,
            method: 'PUT',
            data: JSON.stringify(updateData),
            dataType: 'json',
            contentType:'application/json',
            headers: {'Authorization': `Bearer ${storedToken}`},
            success: function() {
                t.row(this)
                .invalidate()
                .draw()
            },
            error: catchAllError
        })
        }
    })
}

//user clicks on the logo and redirected to home page
function logOut(){
    window.location.href= '/'
}
