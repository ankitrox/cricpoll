export async function login(username, password) {
    const res = await fetch('https://api.ankitgade.in/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);
        return data;
    } else {
        throw new Error(data.message || 'Login failed');
    }
}
