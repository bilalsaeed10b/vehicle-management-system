document.getElementById('vehicle-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const vehicleBrand = document.getElementById('vehicleBrand').value;
    const chesisNumber = document.getElementById('chesisNumber').value;

    const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, phone, address, vehicleBrand, chesisNumber })
    });

    if (response.ok) {
        const vehicle = await response.json();
        addVehicleToList(vehicle);
        document.getElementById('vehicle-form').reset();
    } else {
        alert('Failed to add vehicle');
    }
});

function addVehicleToList(vehicle) {
    const vehicleList = document.getElementById('vehicle-list');
    const div = document.createElement('div');
    div.className = 'vehicle';
    div.innerHTML = `
        <h3>${vehicle.firstName} ${vehicle.lastName}</h3>
        <p><strong>Email:</strong> ${vehicle.email}</p>
        <p><strong>Phone:</strong> ${vehicle.phone}</p>
        <p><strong>Address:</strong> ${vehicle.address}</p>
        <p><strong>Vehicle Brand:</strong> ${vehicle.vehicleBrand}</p>
        <p><strong>Chesis Number:</strong> ${vehicle.chesisNumber}</p>
    `;
    vehicleList.appendChild(div);
}
