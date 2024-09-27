document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate input fields
        if (!email || !password) {
            alert('Please fill in both fields.');
            return;
        }

        // Create the payload to be sent to the server
        const formData = {
            email: email,
            password: password
        };

        // Send the data to the backend
        fetch('http://localhost:5001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData) // Convert formData object to JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Login successful! Redirecting...');
                window.location.href = 'home.html'; // Redirect to a specific page after login
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error during login. Please try again.');
        });
    });
});
