/*** Global variables ***/
const url = "http://localhost:5678/";
const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const form = document.querySelector(".login form");
const loginErrorMessage = document.querySelector(".login p");



form.addEventListener('submit', function(event){
    event.preventDefault();
    getUsers();
})


async function getUsers() { 
    const body = JSON.stringify ({email: email.value, password: password.value})
    fetch(url + 'api/users/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: body
})

.then (response => {
    if (!response.ok) {
        throw new Error ('Erreur lors de la connexion');
    }
    return response.json();
})
.then(data => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('authentifie', 'true');
    window.location.href = 'index.html';
})

.catch (error => {
    console.error(error);
    loginErrorMessage.textContent="Erreur dans l’identifiant ou le mot de passe."
})

}
