// --- DATA PRODUK (Database Simulasi) ---
const categories = [
    { id: 'bingkai', name: 'Photo Frame Custom', image: 'img/kategori frame costum.jpeg', color: 'bg-indigo-200' },
    { id: 'polaroid', name: 'Photo Polaroid', image: 'img/kategori polaroid.jpeg', color: 'bg-orange-100' },
    { id: 'hampers', name: 'Hampers', image: 'img/kategori hampers.jpeg', color: 'bg-green-100' },
    { id: 'sticker', name: 'Sticker Custom', image: 'img/kategori stiker.jpeg', color: 'bg-green-100' },
    { id: 'minigift', name: 'Mini Gift', image: 'img/minigift.jpeg', color: 'bg-green-100' },
    { id: 'buket', name: 'Buket', image: 'img/kategori buket.jpeg', color: 'bg-green-100' },
    
];

const products = [
    { id: 1, name: "Hampers Cowo", category: "hampers", price: 100000, rating: 4.8, isBestSeller: false, image: "img/hampers cowo.jpeg" },
    { id: 2, name: "Scrapbook Frame", category: "bingkai", price: 140000, rating: 4.9, isBestSeller: false, image: "img/scrapbook frame 2.jpeg" },
    { id: 3, name: "Paket Polaroid 25pcs", category: "polaroid", price: 18000, rating: 5.0, isBestSeller: true, image: "img/polaroid.jpeg" },
    { id: 4, name: "Hampers Cewe", category: "hampers", price: 100000, rating: 4.8, isBestSeller: false, image: "img/hampers cewe.jpeg" },
    { id: 5, name: "Scrapbook Frame 2", category: "bingkai", price: 45000, rating: 4.9, isBestSeller: false, image: "img/scrapbook frame.jpeg" },
    { id: 6, name: "Costum Photo Frame", category: "bingkai", price: 35000, rating: 4.9, isBestSeller: true, image: "img/frame.jpeg" },
    { id: 7, name: "Sticker Custom", category: "sticker", price: 10000, rating: 5.0, isBestSeller: true, image: "img/sticker.jpeg" },
    { id: 8, name: "Mini Gift", category: "minigift", price: 2500, rating: 4.8, isBestSeller: false, image: "img/mini.jpeg" },
    { id: 9, name: "Buket", category: "buket", price: 35000, rating: 4.7, isBestSeller: false, image: "img/buket.jpeg" }
];

// --- STATE APLIKASI ---
let cart = [];

// --- FUNGSI UTAMA ---

// 1. Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number).replace(",00","");
}

// 2. Tampilkan/Sembunyikan View
function showView(viewId) {
    // Sembunyikan semua view
    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('product-list-view').classList.add('hidden');
    document.getElementById('home-header').classList.add('hidden');
    document.getElementById('filter-header').classList.add('hidden');

    // Tampilkan view yang diminta dan header yang sesuai
    if (viewId === 'home') {
        document.getElementById('home-view').classList.remove('hidden');
        document.getElementById('home-header').classList.remove('hidden');
    } else if (viewId === 'filter') {
        document.getElementById('product-list-view').classList.remove('hidden');
        document.getElementById('filter-header').classList.remove('hidden');
    }
    window.scrollTo(0, 0); // Gulir ke atas
}

function showHomeView() {
    showView('home');
}

// 3. Render Kartu Produk
function renderProductCard(product) {
    return `
        <div class="product-card group relative cursor-pointer" onclick="addToCart(${product.id})">
            <div class="h-56 bg-gray-100 relative overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                <!-- Rating Badge -->
                <div class="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <i class="ph-fill ph-star text-yellow-400 text-[10px]"></i>
                    <span class="text-[10px] font-bold text-gray-700">${product.rating}</span>
                </div>
                <!-- Add Button Overlay -->
                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span class="bg-white text-gray-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition">Tambah +</span>
                </div>
            </div>
            <div class="p-3">
                <p class="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">${product.category}</p>
                <h3 class="text-sm font-bold text-gray-800 leading-tight mb-2 line-clamp-2 h-[40px]">${product.name}</h3>
                <div class="flex justify-between items-center">
                    <span class="text-sm font-bold text-yellow-600">${formatRupiah(product.price).replace("Rp","Rp ")}</span>
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-yellow-400 transition">
                        <i class="ph-bold ph-shopping-cart text-xs text-gray-600 group-hover:text-white"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 4. Tampilkan Kategori (Home View) - FIXED
function renderCategories() {
    const container = document.getElementById('category-container');
    if (!container) return;

    container.innerHTML = categories.map(cat => {
        // kalau path bukan URL, encode supaya spasi/karakter khusus aman
        const imgSrc = /^https?:\/\//i.test(cat.image) ? cat.image : encodeURI(cat.image);

        // buat nama aman untuk dipakai di atribut onclick / alt / teks
        const safeName = String(cat.name)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '&quot;')
            .replace(/\n/g, ' ');

        return `
        <div class="cursor-pointer rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white" onclick="filterCategory('${cat.id}', '${safeName}')">
            <div class="w-full h-56 relative overflow-hidden">
                <img src="${imgSrc}"
                     alt="${safeName}"
                     onerror="this.onerror=null;this.src='https://placehold.co/300x300/EEEEEE/AAAAAA?text=${encodeURIComponent(safeName)}';"
                     class="w-full h-full object-cover" />
            </div>
            <div class="p-3 text-center">
                <p class="text-sm font-bold text-gray-800">${safeName}</p>
            </div>
        </div>
        `;
    }).join('');
}


// 5. Tampilkan Best Sellers (Home View)
function renderBestSellers() {
    const container = document.getElementById('best-seller-container');
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 3);
    container.innerHTML = bestSellers.map(renderProductCard).join('');
}

// 6. Filter Kategori dan Tampilkan List
function filterCategory(id, name) {
    const filteredProducts = products.filter(p => p.category === id);
    const list = document.getElementById('product-list-filtered');
    const title = document.getElementById('filter-title');

    title.innerText = name;
    list.innerHTML = filteredProducts.map(renderProductCard).join('');
    
    showView('filter'); // Ganti tampilan ke filter view
}


// 7. Tampilkan Keranjang
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    // Ambil badge yang baru di header
    const badgeDesktop = document.getElementById('cart-badge-desktop'); 

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    
    // Update badge di header
    badgeDesktop.innerText = totalItems;
    badgeDesktop.classList.toggle('hidden', totalItems === 0);

    // Jika Kosong
    if (cart.length === 0) {
        container.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-gray-300 mt-10">
            <div class="bg-gray-50 p-6 rounded-full mb-4">
                <i class="ph-duotone ph-shopping-cart text-4xl text-gray-300"></i>
            </div>
            <p class="font-medium text-gray-500">Keranjang kosong</p>
            <p class="text-xs mt-1 text-gray-400">Yuk pilih kenanganmu dulu!</p>
        </div>`;
        totalEl.innerText = formatRupiah(0);
        return;
    }

    // Render Item Keranjang
    let totalPrice = 0;
    container.innerHTML = cart.map(item => {
        totalPrice += item.price * item.qty;
        return `
        <div class="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
            <img src="${item.image}" class="w-16 h-16 rounded-xl object-cover bg-gray-100">
            <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-gray-800 truncate">${item.name}</h4>
                <p class="text-xs text-yellow-600 font-bold mb-2">${formatRupiah(item.price)}</p>
                
                <div class="flex items-center gap-3">
                    <button onclick="updateQty(${item.id}, -1)" class="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-90 transition">
                        <i class="ph-bold ph-minus text-[10px]"></i>
                    </button>
                    <span class="text-sm font-bold w-4 text-center text-gray-800">${item.qty}</span>
                    <button onclick="updateQty(${item.id}, 1)" class="w-6 h-6 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 active:scale-90 transition">
                        <i class="ph-bold ph-plus text-[10px]"></i>
                    </button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-gray-300 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg">
                <i class="ph-fill ph-trash"></i>
            </button>
        </div>
        `;
    }).join('');

    totalEl.innerText = formatRupiah(totalPrice);
}

// --- LOGIKA INTERAKSI KERANJANG ---

// Tambah ke Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    renderCart();
    showToast();
}

// Update Jumlah
function updateQty(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            // Pengganti alert/confirm
            if(confirm('Hapus item ini dari keranjang?')) removeFromCart(id);
            else item.qty = 1; 
        }
    }
    renderCart();
}

// Hapus Item
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Buka/Tutup Modal Cart
function toggleCart(show) {
    const modal = document.getElementById('cart-modal');
    if (show) {
        modal.classList.remove('translate-y-full');
        modal.classList.add('translate-y-0');
    } else {
        modal.classList.add('translate-y-full');
        modal.classList.remove('translate-y-0');
    }
}

// Notifikasi Toast
let toastTimeout;
function showToast() {
    const toast = document.getElementById('toast');
    clearTimeout(toastTimeout);
    
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -20px)';
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, 0)';
    });
    
    toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
    }, 2000);
}

// Checkout WhatsApp
function checkout() {
    if(cart.length === 0) return;
    
    let message = "Haiii Minmyl, saya mau pesan:%0A";
    let totalRupiah = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        totalRupiah += itemTotal;
        message += `${index + 1}. ${item.name} (${item.qty}x) - ${formatRupiah(itemTotal)}%0A`;
    });
    
    message += `%0A*Total Akhir: ${formatRupiah(totalRupiah)}*`;
    message += `%0AMohon diproses ya Minmyl. Terima kasih!`;
    
    // Redirect ke WA (Ganti nomornya)
    window.open(`https://wa.me/6281329865758?text=${message}`, '_blank');
}

// Init saat halaman load
renderCategories();
renderBestSellers();
renderCart();
showHomeView();