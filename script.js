// CONFIGURACIÓN DE SUPABASE
const _URL = "https://ahiywclqqdrobugkaval.supabase.co";
const _KEY = "sb_publishable_4dJKjnB_2ZYXEt5nK2pUOQ_6PGquGmQ";
const supabaseClient = supabase.createClient(_URL, _KEY);

// ⚠️ CAMBIA ESTO POR TU EMAIL DE REGISTRO
const ADMIN_EMAIL = "neox@gmail.com"; 

const scripts = [
    { name: "Neox Core V1", price: 25, tag: "CORE", desc: "Base ESX 0.00ms optimizada." },
    { name: "Neox Banking", price: 15, tag: "UI", desc: "Interfaz bancaria moderna." },
    { name: "Neox Notify", price: 0, tag: "FREE", desc: "Sistema de avisos premium." }
];

async function loadUI() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const authSection = document.getElementById('auth-section');

    if (user && authSection) {
        // Si eres el ADMIN, aparece el botón secreto
        const adminBtn = user.email === ADMIN_EMAIL 
            ? `<a href="admin.html" class="bg-orange-600/20 text-orange-500 border border-orange-500/50 px-4 py-2 rounded-xl hover:bg-orange-600 hover:text-white transition text-xs font-bold">PANEL ADMIN</a>` 
            : '';

        authSection.innerHTML = `
            <div class="flex items-center gap-4">
                ${adminBtn}
                <span class="text-gray-500 text-xs hidden md:block">${user.email}</span>
                <button onclick="logout()" class="text-xs bg-white/5 px-3 py-2 rounded-lg hover:bg-red-500/20 transition">SALIR</button>
            </div>
        `;
    }

    // Renderizar los productos en la tienda
    const container = document.getElementById('scripts-container');
    if (container) {
        container.innerHTML = ''; 
        scripts.forEach(s => {
            container.innerHTML += `
                <div class="glass p-8 rounded-[2rem] border border-white/5 hover:border-orange-500/50 transition-all group">
                    <div class="flex justify-between mb-4">
                        <span class="text-[10px] font-black text-orange-500 tracking-widest">${s.tag}</span>
                    </div>
                    <h3 class="text-2xl font-black mb-2">${s.name}</h3>
                    <p class="text-gray-500 text-sm mb-6">${s.desc}</p>
                    <div class="flex justify-between items-center pt-4 border-t border-white/5">
                        <span class="text-xl font-black">${s.price === 0 ? 'GRATIS' : '$'+s.price}</span>
                        <button onclick="comprar('${s.name}', '${s.price}')" class="bg-white text-black px-6 py-2 rounded-xl font-black text-xs hover:bg-orange-500 hover:text-white transition">
                            COMPRAR
                        </button>
                    </div>
                </div>
            `;
        });
    }
}

// Función para enviar el pedido a la base de datos
async function comprar(nombre, precio) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
        alert("Inicia sesión para realizar el pedido.");
        window.location.href = "login.html";
        return;
    }

    const { error } = await supabaseClient.from('pedidos').insert([
        { email: user.email, script_name: nombre, price: precio.toString() }
    ]);

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("¡Pedido registrado! El admin se pondrá en contacto contigo.");
    }
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.reload();
}

loadUI();