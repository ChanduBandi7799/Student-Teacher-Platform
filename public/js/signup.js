document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        role: document.querySelector('input[name="role"]:checked').value
    };

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            alert(data.msg);
            window.location.href = '/login.html';
        } else {
            alert('Signup failed: ' + data.msg);
        }
    } catch (error) {
        alert('An error occurred during signup');
        console.error('Error:', error);
    }
});