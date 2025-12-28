// ========== LOGIN FUNCTIONALITY ==========

let usuarioCambioClave = null;

// Login with session storage in localStorage
document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();
    const msg = document.getElementById('loginMsg');
    msg.textContent = '';

    const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
    });
    const data = await res.json();

    // If password expired, show modal for mandatory change
    if (data.requiereCambioPassword) {
        usuarioCambioClave = data.user.id_usuario || usuario; // Save id for the change
        mostrarModalCambioPassword();
        msg.style.color = 'orange';
        msg.textContent = data.message || 'La contraseña ha expirado. Debe cambiarla.';
        return;
    }

    if (data.success) {
        msg.style.color = 'green';
        msg.textContent = '¡Login exitoso!';
        localStorage.setItem('usuario', JSON.stringify(data.user));
        setTimeout(() => window.location.href = "/", 500);
    } else {
        msg.style.color = 'red';
        msg.textContent = data.mess
        msg.textContent = data.message || 'Credenciales invalidas.';
    }

    // Redirect to index
    if (localStorage.getItem('usuario')) {
        window.location.href = "/";
    }
}