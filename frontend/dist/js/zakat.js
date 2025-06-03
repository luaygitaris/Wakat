function formatRupiah(angka) {
  if (!angka || isNaN(angka)) return "0,-";
  return angka.toLocaleString("id-ID") + ",-";
}
const pemasukanInput = document.querySelector('input[name="pemasukan"]');
const pengeluaranInput = document.querySelector('input[name="pengeluaran"]');
const penghasilanInput = document.getElementById("penghasilan_bersih");
const keteranganInput = document.getElementById("keterangan_nishab");
const zakatInput = document.getElementById("zakat_25");
const NISHAB = 14200000;
function updatePenghasilanZakat() {
  const pemasukan = Number(pemasukanInput.value);
  const pengeluaran = Number(pengeluaranInput.value);
  const penghasilan = pemasukan - pengeluaran;
  penghasilanInput.value =
    penghasilan > 0 ? formatRupiah(penghasilan) : formatRupiah(0);
  let zakat = 0;
  if (penghasilan >= NISHAB) {
    keteranganInput.value = "Mencapai Nishab";
    zakat = Math.floor(penghasilan * 0.025);
    zakatInput.value = formatRupiah(zakat);
  } else {
    keteranganInput.value = "Belum Mencapai Nishab";
    zakatInput.value = formatRupiah(0);
  }
}
if (pemasukanInput) { 
  pemasukanInput.addEventListener("input", updatePenghasilanZakat);
}
if (pengeluaranInput) {
  pengeluaranInput.addEventListener("input", updatePenghasilanZakat);
}
// document
//   .getElementById("zakatForm")
//   .addEventListener("submit", async function (e) {
//     e.preventDefault();
//     const form = e.target;
//     // Ambil nilai numerik dari penghasilan dan zakat (hilangkan format rupiah)
//     const penghasilanBersih = Number(
//       (form.penghasilan_bersih.value || "0").replace(/[^\d]/g, "")
//     );
//     const zakat25 = Number((form.zakat_25.value || "0").replace(/[^\d]/g, ""));
//     const data = {
//       bulan: form.bulan.value,
//       pemasukan: Number(form.pemasukan.value),
//       pengeluaran: Number(form.pengeluaran.value),
//       penghasilan_bersih: penghasilanBersih,
//       keterangan_nishab: form.keterangan_nishab.value,
//       zakat_25: zakat25,
//     };
//     const token = localStorage.getItem("token");
//     const msgDiv = document.getElementById("msg");
//     if (!token) {
//       msgDiv.textContent = "Anda belum login!";
//       msgDiv.style.color = "red";
//       return;
//     }
//     msgDiv.textContent = "Mengirim...";
//     try {
//       const res = await fetch("http://localhost:4000/zakat-hitung", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//         body: JSON.stringify(data),
//       });
//       const result = await res.json();
//       msgDiv.textContent = result.message || (res.ok ? "Berhasil!" : "Gagal!");
//       msgDiv.style.color = res.ok ? "green" : "red";
//     } catch (err) {
//       msgDiv.textContent = "Gagal mengirim data!";
//       msgDiv.style.color = "red";
//     }
//   });

function contentHitungZakat(contentId) {
  const allContent = document.querySelectorAll('.hitung');

  allContent.forEach((el) => {
    if (el.id === contentId) {
      el.classList.remove("hidden");
      el.classList.add("block");
    } else {
      el.classList.remove("block");
      el.classList.add("hidden");
    }
  });
  // Opsional: Update dropdown agar sinkron
  const dropdown = document.querySelector("select");
  if (dropdown) {
    dropdown.value = contentId;
  }
}

// Panggil fungsi saat halaman dimuat untuk menampilkan konten default
document.addEventListener("DOMContentLoaded", function () {
  // Set default value untuk dropdown
  const dropdown = document.querySelector("select");
  if (dropdown) {
    showContent(dropdown.value);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  showContent("content1"); // Set default tab saat pertama kali dimuat
});

function hitungZakat() {
  const kas = parseFloat(document.getElementById("kas").value) || 0;
  const persediaan =
    parseFloat(document.getElementById("persediaan").value) || 0;
  const piutang = parseFloat(document.getElementById("piutang").value) || 0;
  const utang = parseFloat(document.getElementById("utang").value) || 0;

  const total = kas + persediaan + piutang - utang;
  const zakat = total * 0.025;

  document.getElementById("hasilTabel").innerHTML = `
        <table class="w-full mt-6 table-auto border border-gray-300 text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-4 py-2">Komponen</th>
              <th class="border px-4 py-2">Nilai (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border px-4 py-2">Kas / Uang Tunai</td>
              <td class="border px-4 py-2">Rp ${kas.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Persediaan Barang Dagangan</td>
              <td class="border px-4 py-2">Rp ${persediaan.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Piutang (yang bisa ditagih)</td>
              <td class="border px-4 py-2">Rp ${piutang.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Dikurangi: Utang Jatuh Tempo</td>
              <td class="border px-4 py-2">Rp ${utang.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
            <tr class="font-semibold bg-yellow-100">
              <td class="border px-4 py-2">Total Harta Bersih</td>
              <td class="border px-4 py-2 text-blue-600">Rp ${total.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
            <tr class="font-bold bg-green-100">
              <td class="border px-4 py-2">Zakat 2.5%</td>
              <td class="border px-4 py-2 text-red-600">Rp ${zakat.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 bg-gray-50 border-l-4 border-green-600 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Dalil Zakat Perniagaan</h3>
          <p class="text-sm text-gray-700">
            Allah SWT berfirman:<br>
            <span class="italic text-gray-900">"Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka..."</span><br>
            <strong>(QS. At-Taubah: 103)</strong>
          </p>
        </div>
      `;
}
function hitungZakatEmas() {
  const berat = parseFloat(document.getElementById("berat").value) || 0;
  const harga = parseFloat(document.getElementById("harga").value) || 0;
  const total = berat * harga;
  const nisab = 85 * harga;
  const wajibZakat = berat >= 85;
  const zakat = wajibZakat ? total * 0.025 : 0;

  document.getElementById("hasilEmas").innerHTML = `
        <table class="w-full mt-6 table-auto border border-gray-300 text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-4 py-2">Komponen</th>
              <th class="border px-4 py-2">Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border px-4 py-2">Berat Emas/Perak (gram)</td>
              <td class="border px-4 py-2">${berat} gram</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Harga per gram</td>
              <td class="border px-4 py-2">Rp ${harga.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
            <tr class="bg-yellow-100 font-semibold">
              <td class="border px-4 py-2">Total Nilai</td>
              <td class="border px-4 py-2 text-blue-700">Rp ${total.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Nisab (85 gram)</td>
              <td class="border px-4 py-2">Rp ${nisab.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
            <tr>
              <td class="border px-4 py-2">Wajib Zakat?</td>
              <td class="border px-4 py-2">${wajibZakat ? "Ya" : "Tidak"}</td>
            </tr>
            <tr class="bg-green-100 font-bold">
              <td class="border px-4 py-2">Zakat 2.5%</td>
              <td class="border px-4 py-2 text-red-600">Rp ${zakat.toLocaleString(
                "id-ID"
              )}</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 bg-gray-50 border-l-4 border-yellow-500 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Dalil Zakat Emas dan Perak</h3>
          <p class="text-sm text-gray-700">
            Nabi SAW bersabda:<br>
            <span class="italic">"Tidak ada kewajiban zakat atas emas yang kurang dari 20 dinar..."</span><br>
            <strong>(HR. Abu Dawud dan Daruquthni)</strong><br><br>
            Nisab emas adalah 85 gram, dan zakatnya 2.5% jika telah mencapai haul.
          </p>
        </div>
      `;
}
// fungtion zakat ternak
function hitungZakatTernak() {
  const jenis = document.getElementById("jenis").value;
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  let hasil = "";
  let wajibZakat = false;
  let zakat = "";

  if (jenis === "kambing") {
    if (jumlah >= 40 && jumlah < 121) {
      wajibZakat = true;
      zakat = "1 ekor kambing";
    } else if (jumlah >= 121 && jumlah < 201) {
      wajibZakat = true;
      zakat = "2 ekor kambing";
    } else if (jumlah >= 201) {
      wajibZakat = true;
      zakat = "1 ekor kambing setiap 100 ekor";
    }
  } else if (jenis === "sapi") {
    if (jumlah >= 30 && jumlah < 40) {
      wajibZakat = true;
      zakat = "1 ekor sapi tabi’ (usia 1 tahun)";
    } else if (jumlah >= 40 && jumlah < 60) {
      wajibZakat = true;
      zakat = "1 ekor sapi musinnah (usia 2 tahun)";
    } else if (jumlah >= 60) {
      wajibZakat = true;
      zakat = "Tambahkan 1 ekor untuk setiap 30/40 ekor";
    }
  } else if (jenis === "unta") {
    if (jumlah >= 5 && jumlah < 10) {
      wajibZakat = true;
      zakat = "1 ekor kambing";
    } else if (jumlah >= 10 && jumlah < 15) {
      wajibZakat = true;
      zakat = "2 ekor kambing";
    } else if (jumlah >= 15 && jumlah < 20) {
      wajibZakat = true;
      zakat = "3 ekor kambing";
    } else if (jumlah >= 20 && jumlah < 25) {
      wajibZakat = true;
      zakat = "4 ekor kambing";
    } else if (jumlah >= 25) {
      wajibZakat = true;
      zakat = "1 ekor unta betina (bintu makhodh) usia 1 tahun";
    }
  }

  hasil = `
        <table class="w-full mt-6 table-auto border border-gray-300 text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-4 py-2">Jenis Ternak</th>
              <th class="border px-4 py-2">Jumlah</th>
              <th class="border px-4 py-2">Wajib Zakat?</th>
              <th class="border px-4 py-2">Zakat yang Harus Dikeluarkan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border px-4 py-2 capitalize">${jenis}</td>
              <td class="border px-4 py-2">${jumlah}</td>
              <td class="border px-4 py-2">${wajibZakat ? "Ya" : "Tidak"}</td>
              <td class="border px-4 py-2">${wajibZakat ? zakat : "-"}</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 bg-gray-50 border-l-4 border-green-500 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Dalil Zakat Ternak</h3>
          <p class="text-sm text-gray-700">
            Dari Abu Hurairah radhiyallahu ‘anhu, Rasulullah SAW bersabda:<br>
            <span class="italic">"Tidak ada zakat pada unta yang kurang dari lima ekor."</span> <br>
            <strong>(HR. Bukhari dan Muslim)</strong><br><br>
            Zakat ternak wajib dikeluarkan jika jumlahnya telah mencapai nisab dan dimiliki selama 1 tahun (haul).
          </p>
        </div>
      `;

  document.getElementById("hasilTernak").innerHTML = hasil;
}
// fungsion pertanian
function hitungZakatPertanian() {
  const hasilPanen = parseFloat(document.getElementById("hasil").value) || 0;
  const pengairan = document.getElementById("pengairan").value;
  const nisab = 653; // Nisab dalam kg
  let zakat = 0;
  let persen = 0;
  let wajibZakat = hasilPanen >= nisab;

  if (wajibZakat) {
    persen = pengairan === "alami" ? 10 : 5;
    zakat = (hasilPanen * persen) / 100;
  }

  const hasilHTML = `
        <table class="w-full mt-6 table-auto border border-gray-300 text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-4 py-2">Jenis Pengairan</th>
              <th class="border px-4 py-2">Hasil Panen (kg)</th>
              <th class="border px-4 py-2">Wajib Zakat?</th>
              <th class="border px-4 py-2">Persentase Zakat</th>
              <th class="border px-4 py-2">Zakat yang Harus Dikeluarkan (kg)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border px-4 py-2 capitalize">${pengairan}</td>
              <td class="border px-4 py-2">${hasilPanen}</td>
              <td class="border px-4 py-2">${wajibZakat ? "Ya" : "Tidak"}</td>
              <td class="border px-4 py-2">${
                wajibZakat ? persen + "%" : "-"
              }</td>
              <td class="border px-4 py-2">${
                wajibZakat ? zakat.toFixed(2) : "-"
              }</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 bg-gray-50 border-l-4 border-green-500 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Dalil Zakat Pertanian</h3>
          <p class="text-sm text-gray-700">
            Allah SWT berfirman:<br>
            <span class="italic">"Dan berikanlah haknya pada hari memetik hasilnya (zakat),..."</span><br>
            <strong>(QS. Al-An’am: 141)</strong><br><br>
            Rasulullah SAW bersabda:<br>
            <span class="italic">"Tanaman yang disiram air hujan atau mata air maka zakatnya 10%, sedangkan yang disiram dengan tenaga maka zakatnya 5%."</span><br>
            <strong>(HR. Bukhari dan Muslim)</strong>
          </p>
        </div>
      `;

  document.getElementById("hasilPertanian").innerHTML = hasilHTML;
}
// function temuan
function hitungZakatRikaz() {
  const nilaiTemuan =
    parseFloat(document.getElementById("nilaiTemuan").value) || 0;
  const zakat = (nilaiTemuan * 20) / 100;

  const hasilHTML = `
        <table class="w-full mt-6 table-auto border border-gray-300 text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-4 py-2">Jenis</th>
              <th class="border px-4 py-2">Nilai Temuan</th>
              <th class="border px-4 py-2">Persentase Zakat</th>
              <th class="border px-4 py-2">Zakat yang Harus Dikeluarkan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border px-4 py-2">Barang Temuan (Rikaz)</td>
              <td class="border px-4 py-2">Rp ${nilaiTemuan.toLocaleString()}</td>
              <td class="border px-4 py-2">20%</td>
              <td class="border px-4 py-2">Rp ${zakat.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 bg-gray-50 border-l-4 border-yellow-500 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2">Dalil Zakat Rikaz</h3>
          <p class="text-sm text-gray-700">
            Rasulullah SAW bersabda:<br>
            <span class="italic">“Dalam rikaz (harta karun) wajib dikeluarkan satu perlima (20%).”</span><br>
            <strong>(HR. Bukhari & Muslim)</strong>
          </p>
        </div>
      `;

  document.getElementById("hasilRikaz").innerHTML = hasilHTML;
}
