async function handleLogin() {
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });

        const data = await response.json();

        if (data.success) {
            // 1. Запам'ятовуємо, що вхід успішний
            localStorage.setItem('isLoggedIn', 'true');
            
            // 2. ПЕРЕКИДАЄМО НА КАРТУ
            window.location.href = 'карта.html'; 
        } else {
            alert("Помилка: " + data.message);
        }
    } catch (error) {
        alert("Не вдалося з'єднатися з сервером. Перевірте, чи запущений Python.");
    }
}
