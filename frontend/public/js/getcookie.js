fetch("http://localhost:4001/exchange-credentials", {
    method: "POST",
    headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
    body: JSON.stringify({
        "from": "username-password",
        "to": "bearer",
        "email": "derbi@example.com",
        "password": "corrAecthorsebatteryst@ple1"
    }),
    credentials: 'include'
})