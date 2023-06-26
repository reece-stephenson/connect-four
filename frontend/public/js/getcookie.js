
function signInUser() {
    fetch(window.location.origin + "/welcome/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', 'Accept': '*/*'
        },
        body: JSON.stringify({
            "from": "username-password",
            "to": "bearer",
            "email": document.getElementById('usernameInput').value,
            "password": document.getElementById('passwordInput').value
        }),
        credentials: 'include'
    }).then((response) => {
        document.getElementById('errorMessage').style.display = 'none';
        if (response.ok) {
            window.location = window.location.origin;
        }
        else {
            document.getElementById('errorMessage').innerHTML = 'Invalid email or password!!!';
            document.getElementById('errorMessage').style.display = 'block';
        }
    })
        .catch(error => { console.log(error); });
}

if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').addEventListener('click', () => { signInUser() });
}

if (document.getElementById('goToRegisterBtn')) {
    document.getElementById('goToRegisterBtn').addEventListener('click', () => {
        window.location = './register';
    });
}

async function registerUser() {

    let response = await fetch(window.location.origin + "/welcome/signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
            'Accept': '*/*'
        },
        body: JSON.stringify({
            "type": "username-password",
            "email": document.getElementById('emailInput').value,
            "username": document.getElementById('usernameInput').value,
            "password": document.getElementById('passwordInput').value
        }),
        credentials: 'include'
    })

    if (response.ok) {
        fetch(window.location.origin + "/welcome/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
            body: JSON.stringify({
                "from": "username-password",
                "to": "bearer",
                "email": document.getElementById('emailInput').value,
                "password": document.getElementById('passwordInput').value
            }),
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                window.location = window.location.origin;
            }
        })
            .catch(error => { console.log(error); });
    }

    let data = await response.json();

    if (data.message !== undefined) {
        document.getElementById('errorMessage').innerHTML = data.message
        document.getElementById('errorMessage').style.display = 'block';
    } else {
        document.getElementById('errorMessage').style.display = 'none';
    }

}

if (document.getElementById('registerBtn')) {
    document.getElementById('registerBtn').addEventListener('click', () => { registerUser() });
}

if (document.getElementById('passwordInputConfirm') && document.getElementById('passwordInput')) {

    document.getElementById('passwordInputConfirm').addEventListener("input", () => {

        if (document.getElementById('passwordInput').value === document.getElementById('passwordInputConfirm').value) {
            document.getElementById('registerBtn').disabled = false;
        } else {
            document.getElementById('registerBtn').disabled = true;
        }
    })

    document.getElementById('passwordInput').addEventListener("input", () => {

        if (document.getElementById('passwordInput').length > 0 && document.getElementById('passwordInput').value === document.getElementById('passwordInputConfirm').value) {
            document.getElementById('registerBtn').disabled = false;
        } else {
            document.getElementById('registerBtn').disabled = true;
        }
    })
}
