async function handleLogin() {
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;

    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userVal, password: passVal })
    });

    const data = await response.json();

    if (data.success) {
        localStorage.setItem('isLoggedIn', 'true'); // Ставимо прапорець входу
        window.location.href = 'карта.html';
    } else {
        alert("Помилка: " + data.message);
    }
}
