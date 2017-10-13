
$(document).ready(function() {
    const email = $('#sign-in-email').val();
    const password = $('#sign-in-password').val();

    $('#register-link').on('click', showRegisterFn);
    $('#sign-in-button').on('click', signInFn);
    //To Do: validate values from inputs username and password to sign in
    //To Do: validate values from the register form to register
    //$('#register-button').on('submit', registerFn);
    $('#form-button').on('click',showFormFn);
    $('#invoices').DataTable();
    
})
const catchAllError = err => {
        if (err.status === 401) {
          window.location = '/login.html';
        }
      };

//sign in function
function signInFn(username, password) {
    let userData ={ username: username, password: password};
    console.log(userData);
    $.ajax({
        url: '/api/auth/login',
        method: "GET",
        data: JSON.stringify(userData),
        dataType: "json",
        headers:  { 'Authorization': "Basic " + window.btoa(userData.username + ":" + userData.password) },
        success: function(data){
            console.log(data);
            console.log('user is authenticated');
            //now what to do to show that one authenticated user
        },
        error: catchAllError
    })
}

function showFormFn() {
    $('#create-form').removeClass('hidden');
}

function showRegisterFn() {
    $('#sign-in-section').addClass('hidden');
    $('#register-section').removeClass('hidden');
}

