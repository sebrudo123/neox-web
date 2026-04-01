const scripts = [
    { name: "Neox Core V1", desc: "Base optimizada para ESX.", price: "$25.00" },
    { name: "Neox Inventory", desc: "Inventario con metadatos.", price: "$15.00" },
    { name: "Neox Notify", desc: "Notificaciones modernas.", price: "Gratis" }
];

const container = document.getElementById('scripts-container');

scripts.forEach(s => {
    container.innerHTML += `
        <div class="card">
            <h3>${s.name}</h3>
            <p>${s.desc}</p>
            <span class="price">${s.price}</span>
            <button style="margin-top:15px; width:100%; padding:10px; border-radius:5px; border:none; cursor:pointer;">Ver Detalles</button>
        </div>
    `;
});