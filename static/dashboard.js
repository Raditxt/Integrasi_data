// ==============================================================================
// dashboard.js - Logika Frontend untuk Dashboard Toko Komputer
// Mengelola perpindahan tab, CRUD untuk setiap entitas, dan statistik dashboard.
// ==============================================================================

// --- Fungsi Utilitas Umum ---

/**
 * Menampilkan pesan alert kustom yang lebih baik daripada alert() bawaan browser.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {string} type - Tipe pesan (success, error, warning, info).
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      const newContainer = document.createElement('div');
      newContainer.id = 'toast-container';
      newContainer.className = 'fixed top-4 right-4 z-50 space-y-3';
      document.body.appendChild(newContainer);
    }
  
    const toast = document.createElement('div');
    let bgColor = '';
    let textColor = '';
    switch (type) {
      case 'success':
        bgColor = 'bg-green-500';
        textColor = 'text-white';
        break;
      case 'error':
        bgColor = 'bg-red-500';
        textColor = 'text-white';
        break;
      case 'warning':
        bgColor = 'bg-yellow-500';
        textColor = 'text-gray-900';
        break;
      case 'info':
      default:
        bgColor = 'bg-blue-500';
        textColor = 'text-white';
        break;
    }
  
    toast.className = `${bgColor} ${textColor} p-4 rounded-lg shadow-xl flex items-center space-x-3 transform translate-x-full transition-all duration-300 ease-out opacity-0`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="ml-auto -mr-1 -my-1 p-1 rounded-full hover:bg-opacity-20 transition-colors" onclick="this.parentElement.remove()">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
    `;
    document.getElementById('toast-container').appendChild(toast);
  
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    }, 10); // Small delay to trigger transition
  
    setTimeout(() => {
      toast.classList.remove('translate-x-0', 'opacity-100');
      toast.classList.add('translate-x-full', 'opacity-0');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 5000); // Hapus setelah 5 detik
  }
  
  
  /**
   * Fungsi fetch wrapper dengan error handling yang terpusat.
   * @param {string} url - URL endpoint API.
   * @param {object} options - Opsi untuk fetch (method, headers, body, dll.).
   * @returns {Promise<object>} - Promise yang me-resolve dengan data JSON.
   */
  async function apiFetch(url, options = {}) {
    try {
      console.log(`Membuat permintaan ke: ${url} dengan opsi:`, options);
      const response = await fetch(url, options);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Respons non-JSON atau kosong' }));
        const errorMessage = errorData.message || `HTTP error! Status: ${response.status} - ${response.statusText}`;
        console.error(`Gagal melakukan permintaan ke ${url}:`, errorMessage, errorData);
        showToast(`Operasi gagal: ${errorMessage}`, 'error');
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log(`Respons dari ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`Kesalahan jaringan atau parsing saat fetch ${url}:`, error);
      if (!error.message.includes('Operasi gagal')) { // Hindari duplikasi toast jika sudah ditangani di response.ok
         showToast(`Kesalahan jaringan: ${error.message}`, 'error');
      }
      throw error;
    }
  }
  
  /**
   * Mengosongkan form berdasarkan ID-nya.
   * @param {string} formId - ID dari elemen form.
   */
  function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
    }
  }
  
  // --- Fungsi Pemuatan Statistik (Dashboard Overview) ---
  // Helper function for API calls
async function apiFetch(endpoint) {
    const res = await fetch(endpoint);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    }
    return await res.json();
}

// Function to render a bar chart
function renderBarChart(elementId, labels, data, title) {
    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)', // Blue
                    'rgba(34, 197, 94, 0.6)',  // Green
                    'rgba(251, 191, 36, 0.6)', // Yellow
                    'rgba(168, 85, 247, 0.6)', // Purple
                    'rgba(249, 115, 22, 0.6)', // Orange
                    'rgba(239, 68, 68, 0.6)'   // Red
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend for single dataset
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

// Function to render a doughnut chart
function renderDoughnutChart(elementId, labels, data, title) {
    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',  // Blue
                    'rgba(34, 197, 94, 0.7)',   // Green
                    'rgba(251, 191, 36, 0.7)',  // Yellow
                    'rgba(168, 85, 247, 0.7)',  // Purple
                    'rgba(249, 115, 22, 0.7)',  // Orange
                    'rgba(239, 68, 68, 0.7)'    // Red
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

// Main function to load dashboard statistics and render charts
async function loadStatistics() {
    console.log('Memuat statistik dashboard...');
    const statsContainer = document.getElementById('stats-cards');
    const chartsContainer = document.getElementById('charts-container');

    // Show loading states
    statsContainer.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-lg shadow-md text-center col-span-full">
            <p class="text-gray-500">Memuat statistik...</p>
        </div>
    `;
    chartsContainer.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-lg shadow-md text-center col-span-full">
            <p class="text-gray-500">Memuat grafik...</p>
        </div>
    `;

    try {
        const stats = await apiFetch('/dashboard/stats');

        if (stats) {
            // Render numerical statistics cards
            statsContainer.innerHTML = `
                <div class="bg-blue-100 p-6 rounded-lg shadow-md text-center">
                    <p class="text-lg text-blue-700">Total Produk</p>
                    <p class="text-4xl font-bold text-blue-900">${stats.total_products || 0}</p>
                </div>
                <div class="bg-green-100 p-6 rounded-lg shadow-md text-center">
                    <p class="text-lg text-green-700">Total Pelanggan</p>
                    <p class="text-4xl font-bold text-green-900">${stats.total_customers || 0}</p>
                </div>
                <div class="bg-yellow-100 p-6 rounded-lg shadow-md text-center">
                    <p class="text-lg text-yellow-700">Total Pesanan</p>
                    <p class="text-4xl font-bold text-yellow-900">${stats.total_orders || 0}</p>
                </div>
                <div class="bg-purple-100 p-6 rounded-lg shadow-md text-center">
                    <p class="text-lg text-purple-700">Rating Rata-rata</p>
                    <p class="text-4xl font-bold text-purple-900">${(stats.avg_rating || 0).toFixed(1)} ⭐</p>
                </div>
                <div class="bg-orange-100 p-6 rounded-lg shadow-md text-center">
                    <p class="text-lg text-orange-700">Total Supplier</p>
                    <p class="text-4xl font-bold text-orange-900">${stats.total_suppliers || 0}</p>
                </div>
                <div class="bg-red-100 p-6 rounded-lg shadow-md text-center">
                    <p class="text-lg text-red-700">Total Karyawan</p>
                    <p class="text-4xl font-bold text-red-900">${stats.total_employees || 0}</p>
                </div>
            `;
            console.log('Statistik berhasil dimuat.');

            // Render charts
            chartsContainer.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <canvas id="mainStatsBarChart"></canvas>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <canvas id="customerOrderDoughnutChart"></canvas>
                </div>
            `;

            // Data for charts
            const mainLabels = ['Produk', 'Pelanggan', 'Pesanan', 'Supplier', 'Karyawan'];
            const mainData = [
                stats.total_products || 0,
                stats.total_customers || 0,
                stats.total_orders || 0,
                stats.total_suppliers || 0,
                stats.total_employees || 0
            ];
            renderBarChart('mainStatsBarChart', mainLabels, mainData, 'Ikhtisar Jumlah Item');

            const customerOrderLabels = ['Pelanggan', 'Pesanan'];
            const customerOrderData = [stats.total_customers || 0, stats.total_orders || 0];
            renderDoughnutChart('customerOrderDoughnutChart', customerOrderLabels, customerOrderData, 'Distribusi Pelanggan vs Pesanan');


        } else {
            statsContainer.innerHTML = `<div class="bg-gray-100 p-6 rounded-lg text-gray-600 text-center col-span-full">Tidak ada data statistik.</div>`;
            chartsContainer.innerHTML = `<div class="bg-gray-100 p-6 rounded-lg text-gray-600 text-center col-span-full">Tidak ada data grafik.</div>`;
        }
    } catch (error) {
        statsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative col-span-full" role="alert">
            <strong class="font-bold">Error!</strong> <span class="block sm:inline">Gagal memuat statistik.</span>
        </div>`;
        chartsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative col-span-full" role="alert">
            <strong class="font-bold">Error!</strong> <span class="block sm:inline">Gagal memuat grafik.</span>
        </div>`;
        console.error('Error memuat statistik atau grafik:', error);
    }
}

// Call loadStatistics when the DOM is ready (e.g., in a window.onload or DOMContentLoaded event listener)
// window.onload = loadStatistics;
document.addEventListener('DOMContentLoaded', loadStatistics);
  // --- Fungsi Pemuatan & Manajemen Data untuk Setiap Entitas (CRUD) ---
  
  // ============================== PRODUK ==============================
  document.getElementById('form-produk').addEventListener('submit', async function (e) {
    e.preventDefault();
    const payload = {
      nama_produk: document.getElementById('nama_produk').value.trim(),
      brand: document.getElementById('brand').value.trim(),
      harga: parseFloat(document.getElementById('harga').value),
      id_sub_kategori: parseInt(document.getElementById('id_sub_kategori').value),
      id_supplier: parseInt(document.getElementById('id_supplier_produk').value) // ID unik
    };
  
    if (!payload.nama_produk || !payload.brand || isNaN(payload.harga) || isNaN(payload.id_sub_kategori) || isNaN(payload.id_supplier)) {
      showToast('Mohon lengkapi semua field produk dengan benar!', 'warning');
      return;
    }
  
    try {
      const data = await apiFetch('/produk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast(data.message || 'Produk berhasil ditambahkan!', 'success');
      resetForm('form-produk');
      loadProduk();
      loadStatistics(); // Perbarui statistik
    } catch (error) {
      // Error sudah ditangani di apiFetch
    }
  });
  
  async function loadProduk() {
    console.log('Memuat daftar produk...');
    const list = document.getElementById('list-produk');
    list.innerHTML = `<div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center text-blue-600 font-medium col-span-full"><p>Memuat produk...</p></div>`;
  
    try {
      const data = await apiFetch('/produk');
      list.innerHTML = '';
      if (data.length === 0) {
        list.innerHTML = `<div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-center col-span-full">Belum ada produk. Tambahkan yang pertama!</div>`;
        return;
      }
  
      data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-lg';
        card.innerHTML = `
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-1">${p.nama_produk || 'N/A'}</h4>
            <p class="text-sm text-gray-600">Brand: <span class="font-medium">${p.brand || 'N/A'}</span></p>
            <p class="text-blue-600 font-bold text-xl my-2">Rp${(p.harga !== undefined && p.harga !== null) ? parseFloat(p.harga).toLocaleString('id-ID') : '0'}</p>
            <p class="text-xs text-gray-500">ID Produk: <span class="font-mono">${p.id_produk || 'N/A'}</span></p>
            <p class="text-xs text-gray-500">Sub Kategori ID: <span class="font-mono">${p.id_sub_kategori || 'N/A'}</span></p>
            <p class="text-xs text-gray-500">Supplier ID: <span class="font-mono">${p.id_supplier || 'N/A'}</span></p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
          </div>
        `;
        list.appendChild(card);
      });
    } catch (error) {
      list.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded relative col-span-full" role="alert">Gagal memuat produk.</div>`;
    }
  }
  
  // ============================== PELANGGAN ==============================
  document.getElementById('form-pelanggan').addEventListener('submit', async function (e) {
    e.preventDefault();
    const payload = {
      nama_pelanggan: document.getElementById('nama_pelanggan').value.trim(),
      email: document.getElementById('email').value.trim(),
      nomor_telepon: document.getElementById('nomor_telepon_pelanggan').value.trim(), // ID unik
      alamat: document.getElementById('alamat_pelanggan').value.trim() // ID unik
    };
  
    if (!payload.nama_pelanggan || !payload.email || !payload.nomor_telepon || !payload.alamat) {
      showToast('Mohon lengkapi semua field pelanggan dengan benar!', 'warning');
      return;
    }
  
    try {
      const data = await apiFetch('/pelanggan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast(data.message || 'Pelanggan berhasil ditambahkan!', 'success');
      resetForm('form-pelanggan');
      loadPelanggan();
      loadStatistics();
    } catch (error) {}
  });
  
  async function loadPelanggan() {
    console.log('Memuat daftar pelanggan...');
    const list = document.getElementById('list-pelanggan');
    list.innerHTML = `<div class="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center text-purple-600 font-medium col-span-full"><p>Memuat pelanggan...</p></div>`;
  
    try {
      const data = await apiFetch('/pelanggan'); // Asumsi /pelanggan mengembalikan semua pelanggan
      list.innerHTML = '';
      if (data.length === 0) {
        list.innerHTML = `<div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-center col-span-full">Belum ada pelanggan. Tambahkan yang pertama!</div>`;
        return;
      }
  
      data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-lg';
        card.innerHTML = `
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-1">${p.nama_pelanggan || 'N/A'}</h4>
            <p class="text-sm text-gray-600">ID Pelanggan: <span class="font-mono">${p.id_pelanggan || 'N/A'}</span></p>
            <p class="text-sm text-gray-600">Email: <span class="font-medium">${p.email || 'N/A'}</span></p>
            <p class="text-sm text-gray-600">Telepon: <span class="font-medium">${p.nomor_telepon || 'N/A'}</span></p>
            <p class="text-xs text-gray-500 mt-2">Alamat: ${p.alamat || 'N/A'}</p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
          </div>
        `;
        list.appendChild(card);
      });
    } catch (error) {
      list.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded relative col-span-full" role="alert">Gagal memuat pelanggan.</div>`;
    }
  }
  

  
  
  // ============================== PESANAN ==============================
  document.getElementById('form-pesanan').addEventListener('submit', async function (e) {
    e.preventDefault();
    const payload = {
      id_pelanggan: parseInt(document.getElementById('id_pelanggan_pesanan').value), // ID unik
      tanggal_pesanan: document.getElementById('tanggal_pesanan').value,
      total_pesanan: parseFloat(document.getElementById('total_pesanan').value)
    };
  
    if (isNaN(payload.id_pelanggan) || !payload.tanggal_pesanan || isNaN(payload.total_pesanan)) {
      showToast('Mohon lengkapi semua field pesanan dengan benar!', 'warning');
      return;
    }
  
    try {
      const data = await apiFetch('/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast(data.message || 'Pesanan berhasil ditambahkan!', 'success');
      resetForm('form-pesanan');
      loadPesanan();
      loadStatistics();
    } catch (error) {}
  });
  
  async function loadPesanan() {
    console.log('Memuat daftar pesanan...');
    const list = document.getElementById('list-pesanan');
    list.innerHTML = `<div class="bg-teal-50 border border-teal-200 rounded-lg p-6 text-center text-teal-600 font-medium col-span-full"><p>Memuat pesanan...</p></div>`;
  
    try {
      const data = await apiFetch('/pesanan');
      list.innerHTML = '';
      if (data.length === 0) {
        list.innerHTML = `<div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-center col-span-full">Belum ada pesanan. Tambahkan yang pertama!</div>`;
        return;
      }
  
      data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-lg';
        card.innerHTML = `
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-1">Pesanan ID: <span class="font-mono text-teal-700">${p.id_pesanan || 'N/A'}</span></h4>
            <p class="text-sm text-gray-600">Pelanggan ID: <span class="font-mono">${p.id_pelanggan || 'N/A'}</span></p>
            <p class="text-green-600 font-bold text-xl my-2">Rp${(p.total_pesanan !== undefined && p.total_pesanan !== null) ? parseFloat(p.total_pesanan).toLocaleString('id-ID') : '0'}</p>
            <p class="text-xs text-gray-500">Tanggal: ${p.tanggal_pesanan || 'N/A'}</p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
          </div>
        `;
        list.appendChild(card);
      });
    } catch (error) {
      list.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded relative col-span-full" role="alert">Gagal memuat pesanan.</div>`;
    }
  }
  
  // ============================== PENGIRIMAN ==============================
  document.getElementById('form-pengiriman').addEventListener('submit', async function (e) {
    e.preventDefault();
    const payload = {
      id_pesanan: parseInt(document.getElementById('id_pesanan_pengiriman').value),
      kurir: document.getElementById('kurir').value.trim(),
      no_resi: document.getElementById('no_resi').value.trim(),
      status_pengiriman: document.getElementById('status_pengiriman').value,
      tanggal_kirim: document.getElementById('tanggal_kirim').value,
      id_karyawan: document.getElementById('id_karyawan_pengiriman').value ? parseInt(document.getElementById('id_karyawan_pengiriman').value) : null
    };
  
    if (isNaN(payload.id_pesanan) || !payload.kurir || !payload.no_resi || !payload.status_pengiriman || !payload.tanggal_kirim) {
      showToast('Mohon lengkapi semua field pengiriman yang wajib diisi!', 'warning');
      return;
    }
  
    try {
      const data = await apiFetch('/pengiriman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast(data.message || 'Pengiriman berhasil ditambahkan!', 'success');
      resetForm('form-pengiriman');
      loadPengiriman();
      loadStatistics();
    } catch (error) {}
  });
  
  async function loadPengiriman() {
    console.log('Memuat daftar pengiriman...');
    const list = document.getElementById('list-pengiriman');
    list.innerHTML = `<div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center text-indigo-600 font-medium col-span-full"><p>Memuat pengiriman...</p></div>`;
  
    try {
      const data = await apiFetch('/pengiriman');
      list.innerHTML = '';
      if (data.length === 0) {
        list.innerHTML = `<div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-center col-span-full">Belum ada data pengiriman. Tambahkan yang pertama!</div>`;
        return;
      }
  
      data.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-lg';
        const statusColorClass = p.status_pengiriman === 'selesai' ? 'text-green-600' : p.status_pengiriman === 'dikirim' ? 'text-blue-600' : 'text-orange-600';
        card.innerHTML = `
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-1">Pengiriman ID: <span class="font-mono text-indigo-700">${p.id_pengiriman || 'N/A'}</span></h4>
            <p class="text-sm text-gray-600">Pesanan ID: <span class="font-mono">${p.id_pesanan || 'N/A'}</span></p>
            <p class="text-sm text-gray-600">Kurir: <span class="font-medium">${p.kurir || 'N/A'}</span></p>
            <p class="text-sm text-gray-600">No Resi: <span class="font-mono">${p.no_resi || 'N/A'}</span></p>
            <p class="text-sm font-bold ${statusColorClass}">Status: ${p.status_pengiriman || 'N/A'}</p>
            <p class="text-xs text-gray-500">Tanggal Kirim: ${p.tanggal_kirim || 'N/A'}</p>
            <p class="text-xs text-gray-500">ID Karyawan: ${p.id_karyawan || 'Tidak ada'}</p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
          </div>
        `;
        list.appendChild(card);
      });
    } catch (error) {
      list.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded relative col-span-full" role="alert">Gagal memuat pengiriman.</div>`;
    }
  }
  
  
  // ============================== RATING ==============================
  document.getElementById('form-rating').addEventListener('submit', async function (e) {
    e.preventDefault();
    const payload = {
      id_pesanan: parseInt(document.getElementById('id_pesanan_rating').value), // ID unik
      id_pelanggan: parseInt(document.getElementById('id_pelanggan_rating').value), // ID unik
      rating_belanja: parseInt(document.getElementById('rating_belanja').value),
      komentar: document.getElementById('komentar').value.trim() || null
    };
  
    if (isNaN(payload.id_pesanan) || isNaN(payload.id_pelanggan) || isNaN(payload.rating_belanja) || payload.rating_belanja < 1 || payload.rating_belanja > 5) {
      showToast('Mohon lengkapi semua field rating dengan benar (Rating 1-5)!', 'warning');
      return;
    }
  
    try {
      const data = await apiFetch('/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast(data.message || 'Rating berhasil ditambahkan!', 'success');
      resetForm('form-rating');
      loadRating();
      loadStatistics();
    } catch (error) {}
  });
  
  async function loadRating() {
    console.log('Memuat daftar rating...');
    const list = document.getElementById('list-rating');
    list.innerHTML = `<div class="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center text-purple-600 font-medium col-span-full"><p>Memuat rating...</p></div>`;
  
    try {
      const data = await apiFetch('/rating');
      list.innerHTML = '';
      if (data.length === 0) {
        list.innerHTML = `<div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-center col-span-full">Belum ada rating. Tambahkan yang pertama!</div>`;
        return;
      }
  
      // Helper untuk bintang
      const getStarRating = (rating) => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
          stars += (i < rating) ? '⭐' : '☆';
        }
        return stars;
      };
  
      data.forEach(r => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-lg';
        card.innerHTML = `
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-1">Pesanan ID: <span class="font-mono text-purple-700">${r.id_pesanan || 'N/A'}</span></h4>
            <p class="text-sm text-gray-600">Pelanggan ID: <span class="font-mono">${r.id_pelanggan || 'N/A'}</span></p>
            <p class="text-yellow-500 text-2xl font-bold my-2">${getStarRating(r.rating_belanja || 0)} <span class="text-gray-700 text-base">(${r.rating_belanja || 0}/5)</span></p>
            <p class="text-xs text-gray-700 italic">${r.komentar || 'Tidak ada komentar.'}</p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
          </div>
        `;
        list.appendChild(card);
      });
    } catch (error) {
      list.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded relative col-span-full" role="alert">Gagal memuat rating.</div>`;
    }
  }
  

  
  
  // ============================== SUPPLIER ==============================
  document.getElementById('form-supplier').addEventListener('submit', async function (e) {
    e.preventDefault();
    const payload = {
      nama_supplier: document.getElementById('nama_supplier').value.trim(),
      alamat: document.getElementById('alamat_supplier').value.trim(), // ID unik
      kontak: document.getElementById('kontak_supplier').value.trim() // ID unik
    };
  
    if (!payload.nama_supplier || !payload.alamat || !payload.kontak) {
      showToast('Mohon lengkapi semua field supplier yang wajib diisi!', 'warning');
      return;
    }
  
    try {
      const data = await apiFetch('/supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast(data.message || 'Supplier berhasil ditambahkan!', 'success');
      resetForm('form-supplier');
      loadSupplier();
      loadStatistics();
    } catch (error) {}
  });
  
  async function loadSupplier() {
    console.log('Memuat daftar supplier...');
    const namaFilter = document.getElementById('filter-nama-supplier').value.trim(); // ID unik
    const url = namaFilter ? `/supplier?nama_supplier=${encodeURIComponent(namaFilter)}` : '/supplier';
    const list = document.getElementById('list-supplier');
    list.innerHTML = `<div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center text-indigo-600 font-medium col-span-full"><p>Memuat supplier...</p></div>`;
  
    try {
      const data = await apiFetch(url);
      list.innerHTML = '';
      if (data.length === 0) {
        list.innerHTML = `<div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-center col-span-full">Tidak ada supplier ditemukan. ${namaFilter ? `Coba hapus filter "${namaFilter}".` : 'Tambahkan yang pertama!'}</div>`;
        return;
      }
  
      data.forEach(s => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-lg';
        card.innerHTML = `
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-1">Supplier: <span class="text-indigo-700">${s.nama_supplier || 'N/A'}</span></h4>
            <p class="text-sm text-gray-600">ID: <span class="font-mono">${s.id_supplier || 'N/A'}</span></p>
            <p class="text-sm text-gray-600">Alamat: <span class="font-medium">${s.alamat || 'N/A'}</span></p>
            <p class="text-sm text-gray-600">Kontak: <span class="font-mono">${s.kontak || 'N/A'}</span></p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
          </div>
        `;
        list.appendChild(card);
      });
    } catch (error) {
      list.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded relative col-span-full" role="alert">Gagal memuat supplier.</div>`;
    }
  }
  

  
  
  // ============================== KARYAWAN ==============================
  document.getElementById('form-karyawan').addEventListener('submit', async function (e) {
    e.preventDefault();
    const payload = {
      nama_karyawan: document.getElementById('nama_karyawan').value.trim(),
      jabatan: document.getElementById('jabatan').value.trim(),
      nomor_telepon: document.getElementById('nomor_telepon_karyawan').value.trim() // ID unik
    };
  
    if (!payload.nama_karyawan || !payload.jabatan || !payload.nomor_telepon) {
      showToast('Mohon lengkapi semua field karyawan yang wajib diisi!', 'warning');
      return;
    }
  
    try {
      const data = await apiFetch('/karyawan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast(data.message || 'Karyawan berhasil ditambahkan!', 'success');
      resetForm('form-karyawan');
      loadKaryawan();
      loadStatistics();
    } catch (error) {}
  });
  
  async function loadKaryawan() {
    console.log('Memuat daftar karyawan...');
    const list = document.getElementById('list-karyawan');
    list.innerHTML = `<div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-600 font-medium col-span-full"><p>Memuat karyawan...</p></div>`;
  
    try {
      const data = await apiFetch('/karyawan');
      list.innerHTML = '';
      if (data.length === 0) {
        list.innerHTML = `<div class="bg-gray-100 p-4 rounded-lg text-gray-600 text-center col-span-full">Belum ada karyawan. Tambahkan yang pertama!</div>`;
        return;
      }
  
      data.forEach(k => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:shadow-lg';
        card.innerHTML = `
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-1">Nama: <span class="text-red-700">${k.nama_karyawan || 'N/A'}</span></h4>
            <p class="text-sm text-gray-600">ID: <span class="font-mono">${k.id_karyawan || 'N/A'}</span></p>
            <p class="text-sm text-gray-600">Jabatan: <span class="font-medium">${k.jabatan || 'N/A'}</span></p>
            <p class="text-sm text-gray-600">Telepon: <span class="font-mono">${k.nomor_telepon || 'N/A'}</span></p>
          </div>
          <div class="mt-4 flex justify-end space-x-2">
          </div>
        `;
        list.appendChild(card);
      });
    } catch (error) {
      list.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded relative col-span-full" role="alert">Gagal memuat karyawan.</div>`;
    }
  }
  
  // --- Pengelolaan Tab dan Inisialisasi ---
  
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  /**
   * Mengaktifkan tab yang dipilih dan memuat datanya.
   * @param {string} tabId - ID dari tab yang akan diaktifkan (misal: 'produk', 'pelanggan').
   */
  function activateTab(tabId) {
    tabLinks.forEach(link => {
      link.classList.remove('active', 'bg-blue-100', 'text-blue-700'); // Hapus gaya aktif sebelumnya
      link.classList.add('text-gray-700'); // Tambahkan gaya non-aktif
    });
    tabPanes.forEach(pane => pane.classList.remove('active'));
  
    const activeLink = document.querySelector(`.tab-link[href="#${tabId}"]`);
    const activePane = document.getElementById(tabId);
  
    if (activeLink && activePane) {
      activeLink.classList.add('active', 'bg-blue-100', 'text-blue-700'); // Tambahkan gaya aktif
      activeLink.classList.remove('text-gray-700'); // Hapus gaya non-aktif
      activePane.classList.add('active');
  
      // Panggil fungsi pemuatan data yang sesuai untuk tab yang aktif
      switch (tabId) {
        case 'overview':
          loadStatistics();
          break;
        case 'produk':
          loadProduk();
          break;
        case 'pelanggan':
          loadPelanggan();
          break;
        case 'pesanan':
          loadPesanan();
          break;
        case 'pengiriman':
          loadPengiriman();
          break;
        case 'rating':
          loadRating();
          break;
        case 'supplier':
          loadSupplier();
          break;
        case 'karyawan':
          loadKaryawan();
          break;
        default:
          console.warn(`Tab ID tidak dikenal: ${tabId}`);
      }
    }
  }
  
  // Event listener untuk perpindahan tab
  document.addEventListener('DOMContentLoaded', () => {
    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault(); // Mencegah perubahan URL default
        const tabId = this.getAttribute('href').substring(1); // Ambil ID dari href
        activateTab(tabId);
      });
    });
  
    // Aktifkan tab pertama (Ringkasan) saat halaman dimuat
    activateTab('overview');
  });
  window.onload = function () {
    loadStatistics();
    loadProduk();
    loadPelanggan();
    loadPesanan();
    loadPengiriman();
    loadRating();
    loadSupplier();
    loadKaryawan();
  };
  