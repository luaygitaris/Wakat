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
  const allContent = document.querySelectorAll(".hitung");
  allContent.forEach((el) => {
    el.classList.toggle("hidden", el.id !== contentId);
    el.classList.toggle("block", el.id === contentId);
  });

  // Sinkronisasi dropdown
  const dropdown = document.querySelector("select");
  if (dropdown) {
    dropdown.value = contentId;
  }

  // Tambahkan atau hapus class 'active' pada tombol tab
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((btn) => {
    btn.classList.remove("active");
  });

  const activeBtn = Array.from(navLinks).find((btn) =>
    btn.getAttribute("onclick")?.includes(contentId)
  );
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

// Jalankan saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Tampilkan form default (Froam1)
  contentHitungZakat("Froam1");
});

function hitungZakat() {
  const kas = parseFloat(document.getElementById("kas").value) || 0;
  const persediaan =
    parseFloat(document.getElementById("persediaan").value) || 0;
  const piutang = parseFloat(document.getElementById("piutang").value) || 0;
  const utang = parseFloat(document.getElementById("utang").value) || 0;
  const hargaEmas = parseFloat(document.getElementById("hargaEmas").value) || 0;

  const total = kas + persediaan + piutang - utang;
  const hasilTabel = document.getElementById("hasilTabel");

  // Hitung nisab berdasarkan harga emas saat ini (85 gram emas)
  const nisab = 85 * hargaEmas;

  if (hargaEmas <= 0) {
    hasilTabel.innerHTML = `
      <div class="mt-6 bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
        <h3 class="text-lg font-semibold mb-2">Harga emas belum diisi</h3>
        <p class="text-sm text-gray-700">Silakan isi harga emas per gram terlebih dahulu.</p>
      </div>
    `;
    return;
  }

  if (total <= 0) {
    hasilTabel.innerHTML = `
      <div class="mt-6 bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
        <h3 class="text-lg font-semibold mb-2">Tidak Ada Kewajiban Zakat</h3>
        <p class="text-sm text-gray-700">
          Total harta bersih Anda adalah Rp ${total.toLocaleString(
            "id-ID"
          )}.<br>
          Karena hasilnya 0, maka tidak ada kewajiban zakat.
        </p>
      </div>
    `;
    return;
  }

  const wajibZakat = total >= nisab;
  const zakat = wajibZakat ? total * 0.025 : 0;

  hasilTabel.innerHTML = `
    <table class="responsive-table w-full mt-6 table-auto border border-gray-300 text-left">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2">Komponen</th>
          <th class="border px-4 py-2">Nilai (Rp)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border px-4 py-2">Kas / Uang Tunai</td>
          <td class="border px-4 py-2">Rp ${kas.toLocaleString("id-ID")}</td>
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
          <td class="border px-4 py-2">Rp ${utang.toLocaleString("id-ID")}</td>
        </tr>
        <tr class="font-semibold bg-yellow-100">
          <td class="border px-4 py-2">Total Harta Bersih</td>
          <td class="border px-4 py-2 text-blue-600">Rp ${total.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2">Nisab Zakat (85gr x Rp ${hargaEmas.toLocaleString(
            "id-ID"
          )})</td>
          <td class="border px-4 py-2">Rp ${nisab.toLocaleString("id-ID")}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2">Status</td>
          <td class="border px-4 py-2 font-bold ${
            wajibZakat ? "text-green-600" : "text-red-600"
          }">
            ${wajibZakat ? "Wajib Zakat" : "Belum Wajib Zakat"}
          </td>
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
      <strong>Hadis No. 492 dalam Bulugh al-Maram :</strong>
      <div class="flex flex-col text-center mt-4 gap-2">
        <p class="text-xl mt-4 text-gray-700">    
          عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:
"مَا مِنْ صَاحِبِ ذَهَبٍ وَلَا فِضَّةٍ لَا يُؤَدِّي مِنْهَا حَقَّهَا إِلَّا إِذَا كَانَ يَوْمُ الْقِيَامَةِ صُفِّحَتْ لَهُ صَفَائِحُ مِنْ نَارٍ، فَأُحْمِيَ عَلَيْهَا فِي نَارِ جَهَنَّمَ، فَيُكْوَى بِهَا جَنْبُهُ وَجَبِينُهُ وَظَهْرُهُ..."
        </p>
          <P class="text-sm ">
            "Tidak ada seorang pemilik emas dan perak yang tidak menunaikan haknya (zakatnya), kecuali pada hari kiamat akan dibuatkan untuknya lempengan dari api neraka, lalu dipanaskan dalam neraka Jahanam, lalu disetrika dengannya lambung, dahi, dan punggungnya..."
          </P>
      </div>
      <strong class="mt-4">Penjelasan :</strong>
      <p>
          Hadis ini berbicara tentang ancaman bagi orang yang tidak menunaikan zakat harta, terutama emas dan perak. Dalam praktiknya, zakat perniagaan dihitung berdasarkan nilai harta dagangan, dan nilai itu sering dikonversi dalam satuan emas atau perak, sehingga diqiyaskan dengan zakat emas dan perak. cara hitungnya juga sama. Jika nilainya setara 85 gram emas dan sudah dimiliki selama 1 tahun, wajib zakat 2,5%.
      </p>
    </div>
  `;
}

function hitungEmasPerak() {
  const jenis = document.getElementById("jenis").value;
  const berat = parseFloat(document.getElementById("berat").value) || 0;
  const harga = parseFloat(document.getElementById("harga").value) || 0;

  const total = berat * harga;
  const nisabGram = jenis === "emas" ? 85 : 595;
  const nisab = nisabGram * harga;
  const wajibZakat = berat >= nisabGram;
  const zakat = wajibZakat ? total * 0.025 : 0;
  const namaLogam = jenis === "emas" ? "Emas" : "Perak";

  // Dalil berbeda untuk emas dan perak
  let dalilArab, dalilLatin, dalilPenjelasan, nomerDalil;

  if (jenis === "emas") {
    nomerDalil = `Kitab Bulugh al-Marām, Hadis No. 478`;
    dalilArab = `عَنْ عَلِيٍّ رَضِيَ اللَّهُ عَنْهُ، قَالَ:
لَيْسَ فِي الْوَاقِصِ زَكَاةٌ  .`;
    dalilLatin = `Tidak ada zakat pada emas yang kurang dari satu waqish (sekitar 85 gram).`;
    dalilPenjelasan = `"Waqish" adalah batas minimal zakat emas.Waqish sekitar 85 gram emas murni setara dengan 20 dinar.Jadi, jika seseorang memiliki emas kurang dari 85 gram, tidak wajib zakat.Tapi jika sudah mencapai 85 gram atau lebih,dan apabila telah mencapai haul (1 tahun),  maka wajib zakat 2,5% dari total emasnya`;
  } else {
    nomerDalil = `Kitab Bulugh al-Marām, Hadis No. 479`;
    dalilArab = `وَعَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ رَضِيَ اللَّهُ عَنْهُ، قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ:
لَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ.`;
    dalilLatin = `Dari Abu Sa’id al-Khudri radhiyallahu ‘anhu, Rasulullah ﷺ bersabda:"Tidak ada zakat pada perak yang kurang dari lima uqiyah."`;
    dalilPenjelasan = `5 uqiyah samadengan 200 dirham. 1 dirham samadengan 2.975 gram perak, 200 dirham samadengan 595 gram perak. Maka, perak yang kurang dari 595 gram tidak wajib zakat.
 Bila sudah mencapai 595 gram atau lebih, dan telah mencapai haul (1 tahun), maka wajib zakat 2,5% dari total perak yang dimiliki, maka  wajib zakat 2,5% dari total perak tersebut. `;
  }

  document.getElementById("hasilEmas").innerHTML = `
    <table class="responsive-table w-full mt-6 table-auto border text-left">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-4 py-2">Komponen</th>
          <th class="border px-4 py-2">Nilai</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="border px-4 py-2">Jenis Logam</td><td class="border px-4 py-2">${namaLogam}</td></tr>
        <tr><td class="border px-4 py-2">Berat</td><td class="border px-4 py-2">${berat} gram</td></tr>
        <tr><td class="border px-4 py-2">Harga per gram</td><td class="border px-4 py-2">Rp ${harga.toLocaleString(
          "id-ID"
        )}</td></tr>
        <tr class="bg-yellow-100 font-semibold">
          <td class="border px-4 py-2">Total Nilai</td>
          <td class="border px-4 py-2 text-blue-700">Rp ${total.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2">Nisab (${nisabGram} gram)</td>
          <td class="border px-4 py-2">Rp ${nisab.toLocaleString("id-ID")}</td>
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

     <div class="mt-6 bg-gray-50 border-l-4 border-green-600 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Dalil Zakat ${namaLogam}}</h3>
      <strong>${nomerDalil}</strong>
      <div class="flex flex-col text-center mt-4 gap-2">
        <p class="text-xl mt-4 text-gray-700">    
          ${dalilArab}
        </p>
          <P class="text-sm ">
            ${dalilLatin}
          </P>
      </div>
      <strong class="mt-4">Penjelasan :</strong>
      <p>
          ${dalilPenjelasan}
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
  <table class="responsive-table w-full mt-6 table-auto border border-gray-300 text-left">
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
        <td class="border px-4 py-2 capitalize" data-label="Jenis Ternak">${jenis}</td>
        <td class="border px-4 py-2" data-label="Jumlah">${jumlah}</td>
        <td class="border px-4 py-2" data-label="Wajib Zakat?">${
          wajibZakat ? "Ya" : "Tidak"
        }</td>
        <td class="border px-4 py-2" data-label="Zakat yang Harus Dikeluarkan">${
          wajibZakat ? zakat : "-"
        }</td>
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
    <table class="responsive-table w-full mt-6 table-auto border border-gray-300 text-left">
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
          <td class="border px-4 py-2 capitalize" data-label="Jenis Pengairan">${pengairan}</td>
          <td class="border px-4 py-2" data-label="Hasil Panen (kg)">${hasilPanen}</td>
          <td class="border px-4 py-2" data-label="Wajib Zakat?">${
            wajibZakat ? "Ya" : "Tidak"
          }</td>
          <td class="border px-4 py-2" data-label="Persentase Zakat">${
            wajibZakat ? persen + "%" : "-"
          }</td>
          <td class="border px-4 py-2" data-label="Zakat yang Harus Dikeluarkan (kg)">${
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
    <table class="responsive-table w-full mt-6 table-auto border border-gray-300 text-left">
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
          <td class="border px-4 py-2" data-label="Jenis">Barang Temuan (Rikaz)</td>
          <td class="border px-4 py-2" data-label="Nilai Temuan">Rp ${nilaiTemuan.toLocaleString(
            "id-ID"
          )}</td>
          <td class="border px-4 py-2" data-label="Persentase Zakat">20%</td>
          <td class="border px-4 py-2" data-label="Zakat">Rp ${zakat.toLocaleString(
            "id-ID"
          )}</td>
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
document.addEventListener("DOMContentLoaded", function () {
  lucide.createIcons(); // Render icon lucide

  const monthNames = [
    "Muharram",
    "Safar",
    "Rabiul Awal",
    "Rabiul Akhir",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rajab",
    "Sya'ban",
    "Ramadhan",
    "Syawal",
    "Zulkaidah",
    "Dzulhijjah",
  ];

  let currentDate = new Date(); // Tanggal saat ini

  function renderCalendar(date) {
    const hijriFormatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const parts = hijriFormatter.formatToParts(date);
    const hijriMonth = parseInt(parts.find((p) => p.type === "month").value);
    const hijriYear = parseInt(parts.find((p) => p.type === "year").value);

    document.getElementById("monthTitle").innerText = `${
      monthNames[hijriMonth - 1]
    } ${hijriYear} H`;

    const daysContainer = document.getElementById("contentTanggal");
    daysContainer.innerHTML = "";
    console.log(daysContainer);

    // Header hari
    const weekdays = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jum'at",
      "Sabtu",
    ];
    weekdays.forEach((day) => {
      const div = document.createElement("div");
      div.className = "font-medium";
      div.innerText = day;
      daysContainer.appendChild(div);
    });

    // Hitung jumlah hari dalam bulan Hijriah ini
    const tempDate = new Date(date);
    let daysInMonth = 30; // asumsi default

    for (let i = 31; i <= 30; i++) {
      const testDate = new Date(tempDate);
      testDate.setDate(1);
      testDate.setDate(testDate.getDate() + i - 1);

      const partsTest = hijriFormatter.formatToParts(testDate);
      const testMonth = parseInt(
        partsTest.find((p) => p.type === "month").value
      );

      if (testMonth !== hijriMonth) {
        daysInMonth = i - 1;
        break;
      }
    }

    // Cari hari apa tanggal 1 Hijriah jatuh (0 = Minggu)
    const firstHijriDate = new Date(date);
    firstHijriDate.setDate(1); // Set tanggal ke 1
    const hijriToGregorian = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const firstHijriParts = hijriToGregorian.formatToParts(firstHijriDate);
    const firstHijriMonth = parseInt(
      firstHijriParts.find((p) => p.type === "month").value
    );

    // Cari tanggal Gregorian yang cocok dengan 1 Hijriah
    let gregorianDateForFirstHijri;
    for (let offset = -15; offset <= 15; offset++) {
      const temp = new Date(firstHijriDate);
      temp.setDate(temp.getDate() + offset);
      const parts = hijriToGregorian.formatToParts(temp);
      const day = parseInt(parts.find((p) => p.type === "day").value);
      const month = parseInt(parts.find((p) => p.type === "month").value);
      if (day === 1 && month === firstHijriMonth) {
        gregorianDateForFirstHijri = temp;
        break;
      }
    }

    const startDay = gregorianDateForFirstHijri.getDay(); // Hari (0-6)

    // Tambahkan padding kosong di awal
    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement("div");
      daysContainer.appendChild(empty);
    }

    // Render hari-hari bulan ini
    for (let i = 1; i <= daysInMonth; i++) {
      const div = document.createElement("div");
      div.className = "py-0.5 rounded relative";
      div.setAttribute("data-hijri", i);
      div.innerText = i;
      daysContainer.appendChild(div);
    }

    // Tandai hari ini
    const today = new Date();
    const todayHijriParts = hijriFormatter.formatToParts(today);
    const todayHijriMonth = parseInt(
      todayHijriParts.find((p) => p.type === "month").value
    );
    const todayHijriYear = parseInt(
      todayHijriParts.find((p) => p.type === "year").value
    );
    const todayHijriDay = parseInt(
      todayHijriParts.find((p) => p.type === "day").value
    );

    if (hijriMonth === todayHijriMonth && hijriYear === todayHijriYear) {
      const elToday = document.querySelector(`[data-hijri="${todayHijriDay}"]`);
      if (elToday) {
        elToday.classList.add("bg-success", "text-white");
      }
    }
  }

  // Navigasi bulan
  document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // Render pertama kali
  renderCalendar(currentDate);
});
