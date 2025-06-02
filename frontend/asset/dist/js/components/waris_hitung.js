function hitungWaris() {
  const total = parseFloat(document.getElementById("harta").value) || 0;
  const istri = parseInt(document.getElementById("istri").value) || 0;
  const agamaIstri = document.getElementById("agama_istri").value;
  const ibu = parseInt(document.getElementById("ibu").value) || 0;
  const agamaIbu = document.getElementById("agama_ibu").value;
  const ayah = parseInt(document.getElementById("ayah").value) || 0;
  const agamaAyah = document.getElementById("agama_ayah").value;
  const anakL = parseInt(document.getElementById("anak_l").value) || 0;
  const agamaAnakL = document.getElementById("agama_anak_l").value;
  const anakP = parseInt(document.getElementById("anak_p").value) || 0;
  const agamaAnakP = document.getElementById("agama_anak_p").value;

  let sisa = total;
  const hasil = [];

  // Istri
  if (istri > 0 && agamaIstri.toLowerCase() === "islam") {
    const bagianIstri = total * (anakL + anakP > 0 ? 1 / 8 : 1 / 4);
    hasil.push({
      ahli: "Istri",
      jumlah: istri,
      perOrang: bagianIstri / istri,
    });
    sisa -= bagianIstri;
  } else if (istri > 0) {
    hasil.push({
      ahli: "Istri",
      jumlah: istri,
      perOrang: 0,
      keterangan:"Tidak berhak menerima warisan karena perbedaan agama.",
    });
  }

  // Ibu
  if (ibu > 0 && agamaIbu.toLowerCase() === "islam") {
    const bagianIbu = total * (anakL + anakP > 0 ? 1 / 6 : 1 / 3);
    hasil.push({
      ahli: "Ibu",
      jumlah: 1,
      perOrang: bagianIbu,
    });
    sisa -= bagianIbu;
  } else if (ibu > 0) {
    hasil.push({
      ahli: "Ibu",
      jumlah: 1,
      perOrang: 0,
      keterangan: "Tidak berhak menerima warisan karena perbedaan agama.",
    });
  }

  // Ayah
  if (ayah > 0 && agamaAyah.toLowerCase() === "islam") {
    if (anakL + anakP > 0) {
      const bagianAyah = (total * 1) / 6;
      hasil.push({
        ahli: "Ayah",
        jumlah: 1,
        perOrang: bagianAyah,
      });
      sisa -= bagianAyah;
    } else {
      hasil.push({
        ahli: "Ayah",
        jumlah: 1,
        perOrang: sisa,
      });
      sisa = 0;
    }
  } else if (ayah > 0) {
    hasil.push({
      ahli: "Ayah",
      jumlah: 1,
      perOrang: 0,
      keterangan: "Tidak berhak menerima warisan karena perbedaan agama.",
    });
  }

  // Anak-anak
  const totalPorsi =
    (agamaAnakL.toLowerCase() === "islam" ? anakL * 2 : 0) +
    (agamaAnakP.toLowerCase() === "islam" ? anakP : 0);

  if (totalPorsi > 0) {
    const perPorsi = sisa / totalPorsi;

    if (anakL > 0) {
      hasil.push({
        ahli: "Anak Laki-laki",
        jumlah: anakL,
        perOrang: agamaAnakL.toLowerCase() === "islam" ? perPorsi * 2 : 0,
        keterangan:
          agamaAnakL.toLowerCase() === "islam"
            ? ""
            : "Tidak berhak menerima warisan karena perbedaan agama.",
      });
    }
    if (anakP > 0) {
      hasil.push({
        ahli: "Anak Perempuan",
        jumlah: anakP,
        perOrang: agamaAnakP.toLowerCase() === "islam" ? perPorsi : 0,
        keterangan:
          agamaAnakP.toLowerCase() === "islam"
            ? ""
            : "Tidak berhak menerima warisan karena perbedaan agama.",
      });
    }
    sisa = 0;
  }

  // Tampilkan hasil
  const el = document.getElementById("hasil");
  el.innerHTML = `
    <h3 class="font-bold text-lg mb-2">Hasil Pembagian:</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-700 border text-center">
        <thead class="bg-gray-200 text-gray-800">
          <tr>
            <th class="px-4 py-2 border">Ahli Waris</th>
            <th class="px-4 py-2 border">Jumlah</th>
            <th class="px-4 py-2 border">Bagian Per Orang</th>
            <th class="px-4 py-2 border">Total Perolehan</th>
            <th class="px-4 py-2 border">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${hasil
            .map(
              (h) => `
            <tr class="bg-white border-b">
              <td class="px-4 py-2 border">${h.ahli}</td>
              <td class="px-4 py-2 border">${h.jumlah}</td>
              <td class="px-4 py-2 border">${formatRupiah(h.perOrang)}</td>
              <td class="px-4 py-2 border">${formatRupiah(
                h.perOrang * h.jumlah
              )}</td>
              <td class="px-4 py-2 border">${h.keterangan || "-"}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  // Reset input
  [
    "harta",
    "istri",
    "agama_istri",
    "ibu",
    "agama_ibu",
    "ayah",
    "agama_ayah",
    "anak_l",
    "agama_anak_l",
    "anak_p",
    "agama_anak_p",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
}

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}
