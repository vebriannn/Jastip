const btnPromo = document.getElementById('btnPromo');
const textPromo = document.getElementById('text-potongan-harga');
const textTotalHarga = document.getElementById('totalHarga');
const hargaInput = document.querySelector('input[name="price"]');
const promoSelect = document.getElementById('promo');
const diskonInput = document.getElementById('diskonInput');
const originalPrice = parseFloat(hargaInput.value);

function convertIDR(price) {
    hargaTanpaDesimal = Math.floor(price);
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0 // Menghilangkan angka desimal
    }).format(hargaTanpaDesimal);
}

btnPromo.addEventListener('click', function () {
    if (promoSelect && hargaInput) {
        // Ambil nilai kode promo yang dipilih dan konversi ke angka
        const selectedPromo = parseFloat(promoSelect.value);
        // Hitung jumlah diskon dalam Rupiah berdasarkan harga asli
        const diskon = (selectedPromo / 100) * originalPrice;
        // Hitung total harga setelah diskon
        const totalHarga = originalPrice - diskon;
        // Tampilkan diskon dalam format Rupiah
        textPromo.innerHTML = convertIDR(diskon);
        // Tampilkan total harga setelah diskon dalam format Rupiah
        textTotalHarga.innerHTML = convertIDR(totalHarga);
        // Update nilai input hidden diskon dengan nilai diskon yang dihitung
        diskonInput.value = selectedPromo;
    }
});

