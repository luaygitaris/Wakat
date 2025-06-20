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
// perniagaan
function hitungZakat() {
  const kas = parseFloat(document.getElementById("kas").value) || 0;
  const persediaan =
    parseFloat(document.getElementById("persediaan").value) || 0;
  const piutang = parseFloat(document.getElementById("piutang").value) || 0;
  const utang = parseFloat(document.getElementById("utang").value) || 0;
  const hargaEmas = parseFloat(document.getElementById("hargaEmas").value) || 0;

  const total = kas + persediaan + piutang - utang;
  const hasilTabel = document.getElementById("hasilTabel");

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
          <td class="border px-4 py-2" data-label="Komponen">Kas / Uang Tunai</td>
          <td class="border px-4 py-2" data-label="Nilai (Rp)">Rp ${kas.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Persediaan Barang Dagangan</td>
          <td class="border px-4 py-2" data-label="Nilai (Rp)">Rp ${persediaan.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Piutang (yang bisa ditagih)</td>
          <td class="border px-4 py-2" data-label="Nilai (Rp)">Rp ${piutang.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Dikurangi: Utang Jatuh Tempo</td>
          <td class="border px-4 py-2" data-label="Nilai (Rp)">Rp ${utang.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr class="font-semibold bg-yellow-100">
          <td class="border px-4 py-2" data-label="Komponen">Total Harta Bersih</td>
          <td class="border px-4 py-2 text-blue-600" data-label="Nilai (Rp)">Rp ${total.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Nisab Zakat (85gr x Rp ${hargaEmas.toLocaleString(
            "id-ID"
          )})</td>
          <td class="border px-4 py-2" data-label="Nilai (Rp)">Rp ${nisab.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Status</td>
          <td class="border px-4 py-2 font-bold ${
            wajibZakat ? "text-green-600" : "text-red-600"
          }" data-label="Nilai (Rp)">
            ${wajibZakat ? "Wajib Zakat" : "Belum Wajib Zakat"}
          </td>
        </tr>
        <tr class="font-bold bg-green-100">
          <td class="border px-4 py-2" data-label="Komponen">Zakat 2.5%</td>
          <td class="border px-4 py-2 text-red-600" data-label="Nilai (Rp)">Rp ${zakat.toLocaleString(
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
        <p class="text-sm">
          "Tidak ada seorang pemilik emas dan perak yang tidak menunaikan haknya (zakatnya), kecuali pada hari kiamat akan dibuatkan untuknya lempengan dari api neraka, lalu dipanaskan dalam neraka Jahanam, lalu disetrika dengannya lambung, dahi, dan punggungnya..."
        </p>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <strong class="mt-4">Penjelasan :</strong>
        <p>
          Hadis ini berbicara tentang ancaman bagi orang yang tidak menunaikan zakat harta, terutama emas dan perak. Dalam praktiknya, zakat perniagaan dihitung berdasarkan nilai harta dagangan, dan nilai itu sering dikonversi dalam satuan emas atau perak, sehingga diqiyaskan dengan zakat emas dan perak. Cara hitungnya juga sama. Jika nilainya setara 85 gram emas dan sudah dimiliki selama 1 tahun, maka wajib zakat 2,5%.
        </p>
      </div>
    </div>
  `;
}
// emas perak
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
    dalilArab = `عَنْ عَلِيٍّ رَضِيَ اللَّهُ عَنْهُ، قَالَ: لَيْسَ فِي الْوَاقِصِ زَكَاةٌ.`;
    dalilLatin = `Tidak ada zakat pada emas yang kurang dari satu waqish (sekitar 85 gram).`;
    dalilPenjelasan = `"Waqish" adalah batas minimal zakat emas. Waqish sekitar 85 gram emas murni setara dengan 20 dinar. Jadi, jika seseorang memiliki emas kurang dari 85 gram, tidak wajib zakat. Tapi jika sudah mencapai 85 gram atau lebih, dan apabila telah mencapai haul (1 tahun), maka wajib zakat 2,5% dari total emasnya.`;
  } else {
    nomerDalil = `Kitab Bulugh al-Marām, Hadis No. 479`;
    dalilArab = `وَعَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ رَضِيَ اللَّهُ عَنْهُ، قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ: لَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ.`;
    dalilLatin = `Dari Abu Sa’id al-Khudri radhiyallahu ‘anhu, Rasulullah ﷺ bersabda: "Tidak ada zakat pada perak yang kurang dari lima uqiyah."`;
    dalilPenjelasan = `5 uqiyah sama dengan 200 dirham. 1 dirham setara dengan 2.975 gram perak, sehingga 200 dirham ≈ 595 gram. Maka, perak yang kurang dari 595 gram tidak wajib zakat. Bila sudah mencapai 595 gram atau lebih, dan telah mencapai haul (1 tahun), maka wajib zakat 2,5% dari total perak tersebut.`;
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
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Jenis Logam</td>
          <td class="border px-4 py-2" data-label="Nilai">${namaLogam}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Berat</td>
          <td class="border px-4 py-2" data-label="Nilai">${berat} gram</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Harga per gram</td>
          <td class="border px-4 py-2" data-label="Nilai">Rp ${harga.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr class="bg-yellow-100 font-semibold">
          <td class="border px-4 py-2" data-label="Komponen">Total Nilai</td>
          <td class="border px-4 py-2 text-blue-700" data-label="Nilai">Rp ${total.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Nisab (${nisabGram} gram)</td>
          <td class="border px-4 py-2" data-label="Nilai">Rp ${nisab.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2" data-label="Komponen">Wajib Zakat?</td>
          <td class="border px-4 py-2 ${
            wajibZakat ? "text-green-600" : "text-red-600"
          } font-semibold" data-label="Nilai">
            ${wajibZakat ? "Ya" : "Tidak"}
          </td>
        </tr>
        <tr class="bg-green-100 font-bold">
          <td class="border px-4 py-2" data-label="Komponen">Zakat 2.5%</td>
          <td class="border px-4 py-2 text-red-600" data-label="Nilai">Rp ${zakat.toLocaleString(
            "id-ID"
          )}</td>
        </tr>
      </tbody>
    </table>

    <div class="mt-6 bg-gray-50 border-l-4 border-green-600 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Dalil Zakat ${namaLogam}</h3>
      <strong>${nomerDalil}</strong>
      <div class="flex flex-col text-center mt-4 gap-2">
        <p class="text-xl mt-4 text-gray-700">${dalilArab}</p>
        <p class="text-sm">${dalilLatin}</p>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <strong class="mt-4">Penjelasan :</strong>
        <p>${dalilPenjelasan}</p>
      </div>
    </div>
  `;
}
// fungtion zakat ternak
function hitungZakatTernak() {
  const jenis = document.getElementById("jenisTernak").value;
  const jumlah = parseInt(document.getElementById("jumlahTernak").value) || 0;
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
    } else if (jumlah >= 201 && jumlah < 400) {
      wajibZakat = true;
      zakat = "3 ekor kambing";
    } else if (jumlah >= 400) {
      wajibZakat = true;
      let jumlahZakatKambing = Math.floor(jumlah / 100);
      zakat = `${jumlahZakatKambing} ekor kambing`;
    }
  } else if (jenis === "sapi") {
    if (jumlah < 30) {
      // Tambahkan kondisi jika di bawah nishab
      wajibZakat = false;
      zakat = "Tidak wajib zakat sapi (belum mencapai nishab).";
    } else if (jumlah >= 30 && jumlah < 40) {
      wajibZakat = true;
      zakat = "1 ekor sapi tabi’ (usia 1 tahun)";
    } else if (jumlah >= 40 && jumlah < 60) {
      wajibZakat = true;
      zakat = "1 ekor sapi musinnah (usia 2 tahun)";
    } else if (jumlah >= 60 && jumlah < 70) {
      wajibZakat = true;
      zakat = "2 ekor tabi’";
    } else if (jumlah >= 70 && jumlah < 80) {
      wajibZakat = true;
      zakat = "1 ekor tabi’ dan 1 ekor musinnah";
    } else if (jumlah >= 80 && jumlah < 90) {
      wajibZakat = true;
      zakat = "2 ekor musinnah";
    } else if (jumlah >= 90 && jumlah < 100) {
      wajibZakat = true;
      zakat = "3 ekor tabi’";
    } else if (jumlah >= 100 && jumlah < 110) {
      wajibZakat = true;
      zakat = "2 ekor tabi’ dan 1 ekor musinnah";
    } else if (jumlah >= 110 && jumlah < 120) {
      wajibZakat = true;
      zakat = "1 ekor tabi’ dan 2 ekor musinnah";
    } else if (jumlah >= 120) {
      // Untuk jumlah 120 ke atas
      wajibZakat = true;
      let hasilZakat = "";
      let sisa = jumlah;
      let countMusinnah = 0;
      let countTabi = 0;

      // Prioritaskan mengambil musinnah (kelipatan 40) sebanyak mungkin
      countMusinnah = Math.floor(sisa / 40);
      sisa = sisa % 40;

      // Kemudian, sisa sapi dipecah ke tabi' (kelipatan 30)
      // Jika sisa < 30, maka tidak ada tabi' dari sisa tersebut.
      // Dalam fiqih, sisa di bawah nishab terkecil (30) diabaikan.
      if (sisa >= 30) {
        countTabi = Math.floor(sisa / 30);
      }

      // --- Aturan Khusus untuk angka 120 ---
      // Untuk 120, bisa 3 musinnah (3x40) atau 4 tabi' (4x30).
      // Kita bisa memberikan kedua pilihan atau memilih yang umum (3 musinnah)
      if (jumlah === 120) {
        zakat = "3 ekor musinnah ATAU 4 ekor tabi'"; // Memberikan opsi
      } else {
        // Logika kombinasi untuk > 120
        if (countMusinnah > 0 && countTabi > 0) {
          hasilZakat = `${countMusinnah} ekor musinnah dan ${countTabi} ekor tabi'`;
        } else if (countMusinnah > 0) {
          hasilZakat = `${countMusinnah} ekor musinnah`;
        } else if (countTabi > 0) {
          hasilZakat = `${countTabi} ekor tabi'`;
        } else {
          // Ini seharusnya tidak terjadi jika jumlah >= 120 kecuali ada bug atau sisa terlalu kecil
          hasilZakat =
            "Perhitungan zakat kompleks, mohon konsultasi dengan ahli fiqih.";
        }
        zakat = hasilZakat;
      }
    }
  } else if (jenis === "unta") {
    if (jumlah < 5) {
      // Tambahkan kondisi jika di bawah nishab
      wajibZakat = false;
      zakat = "Tidak wajib zakat unta (belum mencapai nishab).";
    } else if (jumlah >= 5 && jumlah < 10) {
      wajibZakat = true;
      zakat = "1 ekor kambing/domba";
    } else if (jumlah >= 10 && jumlah < 15) {
      wajibZakat = true;
      zakat = "2 ekor kambing/domba";
    } else if (jumlah >= 15 && jumlah < 20) {
      wajibZakat = true;
      zakat = "3 ekor kambing/domba";
    } else if (jumlah >= 20 && jumlah < 25) {
      wajibZakat = true;
      zakat = "4 ekor kambing/domba";
    } else if (jumlah >= 25 && jumlah < 36) {
      wajibZakat = true;
      zakat = "1 ekor bintu makhadh (unta betina berumur 1 tahun)";
    } else if (jumlah >= 36 && jumlah < 46) {
      wajibZakat = true;
      zakat = "1 ekor bintu labun (unta betina berumur 2 tahun)";
    } else if (jumlah >= 46 && jumlah < 61) {
      wajibZakat = true;
      zakat = "1 ekor hiqqah (unta betina berumur 3 tahun)";
    } else if (jumlah >= 61 && jumlah < 76) {
      wajibZakat = true;
      zakat = "1 ekor jadza'ah (unta betina berumur 4 tahun)";
    } else if (jumlah >= 76 && jumlah < 91) {
      wajibZakat = true;
      zakat = "2 ekor bintu labun";
    } else if (jumlah >= 91 && jumlah < 121) {
      wajibZakat = true;
      zakat = "2 ekor hiqqah";
    } else if (jumlah >= 121) {
      // Untuk 121 ekor ke atas
      wajibZakat = true;
      let hasilZakat = "";
      let sisa = jumlah;
      let countHiqqah = 0;
      let countBintuLabun = 0;

      // Pendekatan 1: Prioritaskan kelipatan 50 (Hiqqah), lalu sisa dengan kelipatan 40 (Bintu Labun)
      // Ini adalah salah satu cara pandang yang umum, tapi ingat ada fleksibilitas dalam fiqih.

      countHiqqah = Math.floor(sisa / 50); // Berapa banyak hiqqah dari kelipatan 50
      sisa = sisa % 50; // Sisa setelah mengambil hiqqah

      if (sisa >= 40) {
        // Jika sisa masih cukup untuk bintu labun
        countBintuLabun = Math.floor(sisa / 40);
        sisa = sisa % 40; // Sisa setelah mengambil bintu labun
      }

      // --- Kasus Khusus atau Pilihan Lain ---
      // Untuk jumlah tertentu (misalnya 121), bisa jadi ada kombinasi unik
      // Atau untuk 150 unta, bisa 3 hiqqah (3x50) ATAU (2 bintu labun + 1 hiqqah) jika merujuk ke kombinasi di bawah 120.
      // Fiqih seringkali memberikan opsi yang lebih ringan bagi muzaki atau yang disepakati ulama.

      // Jika jumlah ini cocok dengan kombinasi di bawah 121, bisa di-hardcode
      // Misalnya, 125 unta, bisa 2 hiqqah + 1 bintu makhadh (dari sisa 5 ekor di 25-35)
      // Atau 3 hiqqah jika memilih kelipatan 50.

      // Untuk kalkulator, kita akan coba berikan opsi yang paling umum atau kombinasi yang terstruktur
      let zakatDetail = [];
      if (countHiqqah > 0) {
        zakatDetail.push(`${countHiqqah} ekor hiqqah`);
      }
      if (countBintuLabun > 0) {
        zakatDetail.push(`${countBintuLabun} ekor bintu labun`);
      }

      // Penanganan sisa yang kecil (kurang dari 40)
      // Jika ada sisa setelah perhitungan hiqqah dan bintu labun, itu bisa kembali ke zakat kambing
      // Ini akan membuat kode sangat kompleks, jadi kita beri pesan umum untuk sisa kecil
      if (sisa > 0) {
        // Perhatikan bahwa sisa ini mungkin kembali ke pola kambing/domba jika tidak mencapai nishab unta.
        // Contoh: 130 unta -> 2 hiqqah (dari 100) + sisa 30. Sisa 30 ini bisa jadi 1 bintu makhadh.
        // Atau 125 unta -> 2 hiqqah (dari 100) + sisa 25. Sisa 25 ini 1 bintu makhadh.
        // Untuk penyederhanaan, kita bisa tambahkan logika jika sisa >= 5
        if (sisa >= 25 && sisa < 36) {
          zakatDetail.push("1 ekor bintu makhadh (dari sisa)");
        } else if (sisa >= 20 && sisa < 25) {
          zakatDetail.push("4 ekor kambing/domba (dari sisa)");
        } else if (sisa >= 15 && sisa < 20) {
          zakatDetail.push("3 ekor kambing/domba (dari sisa)");
        } else if (sisa >= 10 && sisa < 15) {
          zakatDetail.push("2 ekor kambing/domba (dari sisa)");
        } else if (sisa >= 5 && sisa < 10) {
          zakatDetail.push("1 ekor kambing/domba (dari sisa)");
        } else if (sisa > 0) {
          // Sisa di bawah 5 unta, tidak wajib zakat dari sisa unta itu sendiri
          // Atau bisa juga dianggap sisa diabaikan jika di bawah nishab unta/kambing minimal
        }
      }

      if (zakatDetail.length > 0) {
        zakat = "Wajib zakat: " + zakatDetail.join(" dan ");
        // Tambahkan peringatan karena kompleksitas
        zakat +=
          ". (Perhitungan di atas 120 ekor unta bisa kompleks dan disarankan konsultasi dengan ahli fiqih untuk detail kombinasinya).";
      } else {
        zakat =
          "Perhitungan zakat unta di atas 120 ekor sangat kompleks dan memerlukan perhitungan kombinasi yang presisi sesuai fiqih.";
      }

      // --- Contoh Penanganan Khas (untuk 121-129 unta) ---
      // Jika mau lebih spesifik untuk 121-129, yang zakatnya adalah 2 hiqqah + sejumlah kambing/bintu makhadh
      // ini akan membutuhkan pengecekan `if (jumlah >= 121 && jumlah < 129)` atau semacamnya
      // Contoh: 121-129 ekor = 2 hiqqah + 1 kambing/domba (dari sisa 1-9)
      // Ini kembali ke pola 2 hiqqah + zakat untuk sisa (1-9 unta)
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

    <div class="mt-6 bg-gray-50 border-l-4 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Dalil Zakat Peternakan</h3>
      <strong>Hadis dari Shahih Bukhari dan Bulugh al-Maram</strong>
      <div class="flex flex-col text-center mt-4 gap-2">
        <p class="text-xl mt-4 text-gray-700">
                  عَنْ أَبِي ذَرٍّ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ ﷺ قَالَ:
          "ما من صاحب إبلٍ، ولا بقرٍ، ولا غنمٍ لا يؤدي منها زكاتها، إلا أُتي بها يوم القيامة أعظم ما كانت وأسمنه، تُوطؤه بأخفافها، وتُنطحه بقرونها، كلما مر عليه أُخراها، رُد عليه أُولاها، في يومٍ كان مقداره خمسين ألف سنة..."
        </p>
        <p class="text-sm">
            “Tidaklah seorang pemilik unta, sapi, atau kambing yang tidak menunaikan zakatnya, melainkan akan didatangkan ternaknya pada hari kiamat dalam keadaan paling besar dan gemuk. Ternak itu menginjak-injak dan menanduknya. Setelah semua melaluinya, yang pertama akan dikembalikan lagi, terus berulang-ulang, selama satu hari yang kadarnya 50.000 tahun...”(HR. Bukhari no. 1338, juga diriwayatkan dalam Bulugh al-Maram hadis no. 494)
        </p>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <strong style="margin-top: 10px;">Penjelasan :</strong>
        <p>
          Zakat peternakan wajib bagi orang yang memelihara ternak seperti unta, sapi, dan kambing/domba, bukan untuk kerja atau angkut barang, tapi untuk diternakkan dan berkembang (biasanya digembalakan). Zakat ini hanya wajib kalau jumlah hewannya sudah mencapai batas minimal (nisab), dipelihara selama 1 tahun penuh (haul), dan dibiarkan makan di padang rumput (bukan dikandangkan dan diberi makan khusus).
        </p>
      </div>
    </div>
  `;

  document.getElementById("hasilTernak").innerHTML = hasil;
}
// fungsion pertanian
function hitungZakatPertanian() {
  const hasilPanen =
    parseFloat(document.getElementById("hasilPanen").value) || 0;
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

    <div class="mt-6 bg-gray-50 border-l-4 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Dalil Zakat Pertanian</h3>
      <strong>Shahih al-Bukhari Hadis no. 1483 dan Shahih Muslim Hadis no. 981:</strong>
      <div class="flex flex-col text-center mt-4 gap-2">
        <p class="text-xl mt-4 text-gray-700">
                      عَنْ عَبْدِ اللَّهِ بْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا قَالَ:
          قَالَ رَسُولُ اللَّهِ ﷺ:
          "فِيمَا سَقَتِ السَّمَاءُ وَالْعُيُونُ أَوْ كَانَ عَثَرِيًّا الْعُشْرُ، وَفِيمَا سُقِيَ بِالنَّضْحِ نِصْفُ الْعُشْرِ."
        </p>
        <p class="text-sm">
          “Tanaman yang diairi oleh air hujan, mata air, atau tumbuh sendiri, zakatnya adalah 10% (sepersepuluh).
          Sedangkan yang diairi dengan alat (irigasi buatan), zakatnya 5% (seperdua puluh).”
        </p>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <strong style="margin-top: 10px;">Penjelasan :</strong>
        <p>
          Zakat pertanian wajib dikeluarkan dari hasil panen seperti padi, gandum, kurma, anggur, dll (menurut sebagian ulama: yang bisa disimpan dan ditakar). Jika tanaman tumbuh dengan air hujan atau alami, zakatnya 10% dari hasil panen. Jika menggunakan biaya atau alat untuk mengairi (misalnya pompa air atau irigasi buatan), zakatnya 5% dari hasil panen. Syarat wajib zakat: hasil panen mencapai nisab (batas minimal), yaitu sekitar 653 kg gabah (5 wasaq).
        </p>
      </div>
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

      <div class="mt-6 bg-gray-50 border-l-4 p-4 rounded">
      <h3 class="text-lg font-semibold mb-2">Dalil Zakat Rikaz(Barang Temuan)</h3>
      <strong> Shahih al-Bukhari No. Hadis: 1499 dan Shahih Muslim No. Hadis: 1710</strong>
      <div class="flex flex-col text-center mt-4 gap-2">
        <p class="text-xl mt-4 text-gray-700">
                  عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ، أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ:
          فِي الرِّكَازِ الْخُمُسُ.
        </p>
        <p class="text-sm">
          Dari Abu Hurairah radhiyallahu ‘anhu, bahwa Rasulullah ﷺ bersabda:
          “Pada harta rikaz (harta terpendam), zakatnya adalah seperlima (20%).”
        </p>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <strong style="margin-top: 10px;">Penjelasan :</strong>
        <p>
          Rikaz adalah harta karun yang ditemukan di dalam tanah, biasanya peninggalan zaman dulu dan tidak diketahui siapa pemiliknya. Jika menemukan rikaz, kita wajib mengeluarkan zakat sebesar 20% (seperlima) langsung saat ditemukan, tanpa perlu menunggu 1 tahun. Zakatnya digunakan untuk kepentingan umum karena harta ini dianggap seperti rampasan perang, bukan milik pribadi.
        </p>
      </div>
    </div>
  `;

  document.getElementById("hasilRikaz").innerHTML = hasilHTML;
}
// document.addEventListener("DOMContentLoaded", function () {
//   lucide.createIcons(); // Render icon lucide

//   const monthNames = [
//     "Muharram",
//     "Safar",
//     "Rabiul Awal",
//     "Rabiul Akhir",
//     "Jumadil Awal",
//     "Jumadil Akhir",
//     "Rajab",
//     "Sya'ban",
//     "Ramadhan",
//     "Syawal",
//     "Zulkaidah",
//     "Dzulhijjah",
//   ];

//   let currentDate = new Date(); // Tanggal saat ini

//   function renderCalendar(date) {
//     const hijriFormatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
//       day: "numeric",
//       month: "numeric",
//       year: "numeric",
//     });

//     const parts = hijriFormatter.formatToParts(date);
//     const hijriMonth = parseInt(parts.find((p) => p.type === "month").value);
//     const hijriYear = parseInt(parts.find((p) => p.type === "year").value);

//     document.getElementById("monthTitle").innerText = `${
//       monthNames[hijriMonth - 1]
//     } ${hijriYear} H`;

//     const daysContainer = document.getElementById("contentTanggal");
//     daysContainer.innerHTML = "";
//     console.log(daysContainer);

//     // Header hari
//     const weekdays = [
//       "Minggu",
//       "Senin",
//       "Selasa",
//       "Rabu",
//       "Kamis",
//       "Jum'at",
//       "Sabtu",
//     ];
//     weekdays.forEach((day) => {
//       const div = document.createElement("div");
//       div.className = "font-medium";
//       div.innerText = day;
//       daysContainer.appendChild(div);
//     });

//     // Hitung jumlah hari dalam bulan Hijriah ini
//     const tempDate = new Date(date);
//     let daysInMonth = 30; // asumsi default

//     for (let i = 31; i <= 30; i++) {
//       const testDate = new Date(tempDate);
//       testDate.setDate(1);
//       testDate.setDate(testDate.getDate() + i - 1);

//       const partsTest = hijriFormatter.formatToParts(testDate);
//       const testMonth = parseInt(
//         partsTest.find((p) => p.type === "month").value
//       );

//       if (testMonth !== hijriMonth) {
//         daysInMonth = i - 1;
//         break;
//       }
//     }

//     // Cari hari apa tanggal 1 Hijriah jatuh (0 = Minggu)
//     const firstHijriDate = new Date(date);
//     firstHijriDate.setDate(1); // Set tanggal ke 1
//     const hijriToGregorian = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
//       day: "numeric",
//       month: "numeric",
//       year: "numeric",
//     });
//     const firstHijriParts = hijriToGregorian.formatToParts(firstHijriDate);
//     const firstHijriMonth = parseInt(
//       firstHijriParts.find((p) => p.type === "month").value
//     );

//     // Cari tanggal Gregorian yang cocok dengan 1 Hijriah
//     let gregorianDateForFirstHijri;
//     for (let offset = -15; offset <= 15; offset++) {
//       const temp = new Date(firstHijriDate);
//       temp.setDate(temp.getDate() + offset);
//       const parts = hijriToGregorian.formatToParts(temp);
//       const day = parseInt(parts.find((p) => p.type === "day").value);
//       const month = parseInt(parts.find((p) => p.type === "month").value);
//       if (day === 1 && month === firstHijriMonth) {
//         gregorianDateForFirstHijri = temp;
//         break;
//       }
//     }

//     const startDay = gregorianDateForFirstHijri.getDay(); // Hari (0-6)

//     // Tambahkan padding kosong di awal
//     for (let i = 0; i < startDay; i++) {
//       const empty = document.createElement("div");
//       daysContainer.appendChild(empty);
//     }

//     // Render hari-hari bulan ini
//     for (let i = 1; i <= daysInMonth; i++) {
//       const div = document.createElement("div");
//       div.className = "py-0.5 rounded relative";
//       div.setAttribute("data-hijri", i);
//       div.innerText = i;
//       daysContainer.appendChild(div);
//     }

//     // Tandai hari ini
//     const today = new Date();
//     const todayHijriParts = hijriFormatter.formatToParts(today);
//     const todayHijriMonth = parseInt(
//       todayHijriParts.find((p) => p.type === "month").value
//     );
//     const todayHijriYear = parseInt(
//       todayHijriParts.find((p) => p.type === "year").value
//     );
//     const todayHijriDay = parseInt(
//       todayHijriParts.find((p) => p.type === "day").value
//     );

//     if (hijriMonth === todayHijriMonth && hijriYear === todayHijriYear) {
//       const elToday = document.querySelector(`[data-hijri="${todayHijriDay}"]`);
//       if (elToday) {
//         elToday.classList.add("bg-success", "text-white");
//       }
//     }
//   }

//   // Navigasi bulan
//   document.getElementById("prevMonth").addEventListener("click", () => {
//     currentDate.setMonth(currentDate.getMonth() - 1);
//     renderCalendar(currentDate);
//   });

//   document.getElementById("nextMonth").addEventListener("click", () => {
//     currentDate.setMonth(currentDate.getMonth() + 1);
//     renderCalendar(currentDate);
//   });

//   // Render pertama kali
//   renderCalendar(currentDate);
// });
