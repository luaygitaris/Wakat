create(data());

function create(data) {
  // Simpan data ke global scope untuk akses mudah
  window.familyTreeData = data;

  const f3Chart = f3
    .createChart("#FamilyChart", data)
    .setTransitionTime(1000)
    .setCardXSpacing(250)
    .setCardYSpacing(150)
    .setSingleParentEmptyCard(true, { label: "ADD" })
    .setShowSiblingsOfMain(false)
    .setOrientationVertical();

  const f3Card = f3Chart
    .setCard(f3.CardHtml)
    .setCardDisplay([["nama lengkap"], ["status"], ["agama"],])
    .setCardDim({})
    .setMiniTree(true)
    .setStyle("imageRect")
    .setOnHoverPathToMain();

  const f3EditTree = f3Chart
    .editTree()
    .fixed(true)
    .setFields(["nama lengkap", "status", "agama", "harta"])
    .setEditFirst(true);

  f3EditTree.setEdit();

  f3Card.setOnCardClick((e, d) => {
    f3EditTree.open(d);
    if (f3EditTree.isAddingRelative()) return;
    f3Card.onCardClickDefault(e, d);
  });

  f3Chart.updateTree({ initial: true });
  f3EditTree.open(f3Chart.getMainDatum());
  f3Chart.updateTree({ initial: true });

  // Simpan referensi global untuk akses dari HTML
  window.f3ChartInstance = f3Chart;
  window.showWarisCalculation = showWarisCalculation;

  // Tambahkan tombol Waris dan Zakat
  addButtons(f3Chart);
}

function data() {
  return [
    {
      id: "0",
      rels: {
        spouses: [],
        children: [],
      },
      data: {
        "first name": "",
        "nama lengkap": "Budi Santoso",
        birthday: 1970,
        avatar:
          "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
        gender: "M",
        status: "hidup/meninggal",
        agama: "Islam",
      },
    },
  ];
}

function addButtons(f3Chart) {
  // Tunggu sampai DOM siap
  setTimeout(() => {
    // Cari container yang sudah ada atau buat baru
    let container = document.getElementById("buttonContainer");

    if (!container) {
      // Buat container baru
      container = document.createElement("div");
      container.id = "buttonContainer";
      container.style.cssText = `
        margin-top: 20px;
        text-align: center;
        padding: 20px;
      `;

      // Cari tempat yang tepat untuk menempatkan container
      const chartContainer = document.getElementById("FamilyChart");
      if (chartContainer && chartContainer.parentNode) {
        chartContainer.parentNode.insertBefore(
          container,
          chartContainer.nextSibling
        );
      } else {
        document.body.appendChild(container);
      }
    }

    // Pastikan container adalah elemen DOM yang valid
    if (container && typeof container.appendChild === "function") {
      // Hapus tombol lama jika ada
      container.innerHTML = "";

      // Buat tombol Waris
      const btnWaris = document.createElement("button");
      btnWaris.id = "calculateInheritance";
      btnWaris.textContent = "Hitung Warisan";
      btnWaris.style.cssText = `
        margin-right: 10px;
        padding: 12px 24px;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      `;

      btnWaris.onmouseover = () => {
        btnWaris.style.backgroundColor = "#1d4ed8";
        btnWaris.style.transform = "translateY(-1px)";
      };

      btnWaris.onmouseout = () => {
        btnWaris.style.backgroundColor = "#2563eb";
        btnWaris.style.transform = "translateY(0)";
      };

      btnWaris.onclick = () => {
        showWarisCalculation(f3Chart);
      };

      // Buat tombol Zakat
      const btnZakat = document.createElement("button");
      btnZakat.id = "calculateZakat";
      btnZakat.textContent = "Hitung Zakat";
      btnZakat.style.cssText = `
        margin-left: 10px;
        padding: 12px 24px;
        background-color: #16a34a;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      `;

      btnZakat.onmouseover = () => {
        btnZakat.style.backgroundColor = "#15803d";
        btnZakat.style.transform = "translateY(-1px)";
      };

      btnZakat.onmouseout = () => {
        btnZakat.style.backgroundColor = "#16a34a";
        btnZakat.style.transform = "translateY(0)";
      };

      btnZakat.onclick = () => {
        alert("Fungsi Zakat akan segera tersedia");
      };

      // Tambahkan tombol ke container
      try {
        container.appendChild(btnWaris);
        container.appendChild(btnZakat);
        console.log("Tombol berhasil ditambahkan");
      } catch (error) {
        console.error("Error menambahkan tombol:", error);

        // Fallback: gunakan innerHTML
        container.innerHTML = `
          <button id="calculateInheritance" onclick="showWarisCalculation(window.f3ChartInstance)" 
                  style="margin-right: 10px; padding: 12px 24px; background-color: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            Hitung Warisan
          </button>
          <button id="calculateZakat" onclick="alert('Fungsi Zakat akan segera tersedia')" 
                  style="margin-left: 10px; padding: 12px 24px; background-color: #16a34a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            Hitung Zakat
          </button>
        `;
      }
    } else {
      console.error("Container tidak valid:", container);
    }
  }, 1000); // Tunggu 1 detik untuk memastikan DOM siap
}

function showWarisCalculation(f3Chart) {
  // Buat modal untuk input perhitungan waris
  const modal = document.createElement("div");
  modal.id = "warisModal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  modalContent.innerHTML = `
    <h2 style="margin-bottom: 20px; text-align: center;">Perhitungan Waris</h2>
    <div style="margin-bottom: 20px;">
      <label>Pilih Almarhum/Almarhumah:</label>
      <select id="selectAlmarhum" style="width: 100%; padding: 8px; margin-top: 5px;">
        <option value="">-- Pilih Almarhum --</option>
      </select>
    </div>
    <div id="hasilWaris"></div>
    <div style="text-align: center; margin-top: 20px;">
      <button id="closeModal" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Tutup</button>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Populate dropdown dengan data dari silsilah
  const selectAlmarhum = document.getElementById("selectAlmarhum");
  let allData = [];

  // Coba berbagai cara untuk mendapatkan data
  try {
    // Method 1: Coba f3Chart.data()
    if (typeof f3Chart.data === "function") {
      allData = f3Chart.data();
    }
    // Method 2: Coba f3Chart.getData()
    else if (typeof f3Chart.getData === "function") {
      allData = f3Chart.getData();
    }
    // Method 3: Coba mengakses data dari create function
    else if (window.familyTreeData) {
      allData = window.familyTreeData;
    }
    // Method 4: Fallback ke data() function
    else {
      allData = data();
    }

    console.log("Data yang ditemukan:", allData);

    if (Array.isArray(allData)) {
      allData.forEach((person) => {
        if (person.data && person.data.status === "meninggal") {
          const option = document.createElement("option");
          option.value = person.id;
          option.textContent = `${person.data["nama lengkap"]} `;
          selectAlmarhum.appendChild(option);
        }
      });
    } else {
      console.error("Data tidak dalam format array:", allData);
      selectAlmarhum.innerHTML +=
        '<option value="">Tidak ada data yang tersedia</option>';
    }
  } catch (error) {
    console.error("Error mengakses data:", error);
    selectAlmarhum.innerHTML +=
      '<option value="">Error mengakses data</option>';
  }

  // Event listener untuk perhitungan
  selectAlmarhum.addEventListener("change", (e) => {
    if (e.target.value) {
      hitungWarisFromSilsilah(f3Chart, e.target.value);
    }
  });

  // Close modal
  document.getElementById("closeModal").onclick = () => {
    document.body.removeChild(modal);
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
}

function hitungWarisFromSilsilah(f3Chart, almarhumId) {
  let allData = [];

  // Coba berbagai cara untuk mendapatkan data
  try {
    if (typeof f3Chart.data === "function") {
      allData = f3Chart.data();
    } else if (typeof f3Chart.getData === "function") {
      allData = f3Chart.getData();
    } else if (window.familyTreeData) {
      allData = window.familyTreeData;
    } else {
      allData = data();
    }
  } catch (error) {
    console.error("Error mengakses data:", error);
    allData = data(); // fallback ke data default
  }

  if (!Array.isArray(allData)) {
    console.error("Data tidak valid:", allData);
    document.getElementById("hasilWaris").innerHTML = `
      <div style="color: red; text-align: center;">
        <p>Error: Data silsilah tidak dapat diakses.</p>
        <p>Silakan refresh halaman dan coba lagi.</p>
      </div>
    `;
    return;
  }

  const almarhum = allData.find((p) => p.id === almarhumId);

  if (!almarhum) {
    document.getElementById("hasilWaris").innerHTML = `
      <div style="color: red; text-align: center;">
        <p>Data almarhum tidak ditemukan.</p>
      </div>
    `;
    return;
  }

  const totalHarta = parseFloat(almarhum.data.harta) || 0;
  if (totalHarta === 0) {
    document.getElementById("hasilWaris").innerHTML = `
      <div style="color: red; text-align: center;">
        <p>Harta almarhum belum diinput atau bernilai 0.</p>
        <p>Silakan edit data almarhum terlebih dahulu.</p>
      </div>
    `;
    return;
  }

  // Identifikasi ahli waris dari silsilah
  const ahliWaris = identifikasiAhliWaris(allData, almarhum);

  // Hitung pembagian waris
  const hasilPembagian = hitungPembagianWaris(totalHarta, ahliWaris, almarhum);

  // Tampilkan hasil
  tampilkanHasilWaris(hasilPembagian, totalHarta, almarhum);
}

function identifikasiAhliWaris(allData, almarhum) {
  const ahliWaris = {
    suami: [],
    istri: [],
    ayah: null,
    ibu: null,
    anakLakiLaki: [],
    anakPerempuan: [],
    saudaraLakiLaki: [],
    saudaraPerempuan: [],
    kakekAyah: null,
    nenekIbu: null,
  };

  // Cari pasangan (suami/istri)
  if (almarhum.rels.spouses) {
    almarhum.rels.spouses.forEach((spouseId) => {
      const spouse = allData.find((p) => p.id === spouseId);
      if (spouse && spouse.data.status === "hidup") {
        if (spouse.data.gender === "M") {
          ahliWaris.suami.push(spouse);
        } else {
          ahliWaris.istri.push(spouse);
        }
      }
    });
  }

  // Cari anak-anak
  if (almarhum.rels.children) {
    almarhum.rels.children.forEach((childId) => {
      const child = allData.find((p) => p.id === childId);
      if (child && child.data.status === "hidup") {
        if (child.data.gender === "M") {
          ahliWaris.anakLakiLaki.push(child);
        } else {
          ahliWaris.anakPerempuan.push(child);
        }
      }
    });
  }

  // Cari orang tua
  allData.forEach((person) => {
    if (person.rels.children && person.rels.children.includes(almarhum.id)) {
      if (person.data.status === "hidup") {
        if (person.data.gender === "M") {
          ahliWaris.ayah = person;
        } else {
          ahliWaris.ibu = person;
        }
      }
    }
  });

  // Cari saudara kandung
  if (ahliWaris.ayah || ahliWaris.ibu) {
    const orangTua = ahliWaris.ayah || ahliWaris.ibu;
    if (orangTua.rels.children) {
      orangTua.rels.children.forEach((siblingId) => {
        if (siblingId !== almarhum.id) {
          const sibling = allData.find((p) => p.id === siblingId);
          if (sibling && sibling.data.status === "hidup") {
            if (sibling.data.gender === "M") {
              ahliWaris.saudaraLakiLaki.push(sibling);
            } else {
              ahliWaris.saudaraPerempuan.push(sibling);
            }
          }
        }
      });
    }
  }

  return ahliWaris;
}

function hitungPembagianWaris(totalHarta, ahliWaris, almarhum) {
  let sisaHarta = totalHarta;
  const hasil = [];

  // Cek apakah almarhum muslim
  const almarhumMuslim = almarhum.data.agama?.toLowerCase() === "islam";

  if (!almarhumMuslim) {
    return [
      {
        ahli: "Tidak ada ahli waris",
        keterangan:
          "Almarhum bukan muslim, warisan tidak dibagi menurut hukum Islam",
      },
    ];
  }

  const adaAnak =
    ahliWaris.anakLakiLaki.length + ahliWaris.anakPerempuan.length > 0;

  // 1. SUAMI
  if (ahliWaris.suami.length > 0) {
    const suami = ahliWaris.suami[0];
    if (suami.data.agama?.toLowerCase() === "islam") {
      const bagian = adaAnak ? totalHarta / 4 : totalHarta / 2; // 1/4 jika ada anak, 1/2 jika tidak
      hasil.push({
        ahli: "Suami",
        nama: `${suami.data["nama lengkap"]} `,
        bagian: bagian,
        persentase: adaAnak ? "1/4" : "1/2",
      });
      sisaHarta -= bagian;
    }
  }

  // 2. ISTRI
  if (ahliWaris.istri.length > 0) {
    const istri = ahliWaris.istri[0];
    if (istri.data.agama?.toLowerCase() === "islam") {
      const bagian = adaAnak ? totalHarta / 8 : totalHarta / 4; // 1/8 jika ada anak, 1/4 jika tidak
      hasil.push({
        ahli: "Istri",
        nama: `${istri.data["nama lengkap"]} `,
        bagian: bagian,
        persentase: adaAnak ? "1/8" : "1/4",
      });
      sisaHarta -= bagian;
    }
  }

  // 3. AYAH
  if (ahliWaris.ayah && ahliWaris.ayah.data.agama?.toLowerCase() === "islam") {
    let bagianAyah;
    if (adaAnak) {
      bagianAyah = totalHarta / 6; // 1/6 jika ada anak
    } else {
      // Jika tidak ada anak, ayah mendapat sisa + 1/6 dari ibu (jika ada)
      bagianAyah = ahliWaris.ibu ? sisaHarta * (2 / 3) : sisaHarta;
    }

    hasil.push({
      ahli: "Ayah",
      nama: `${ahliWaris.ayah.data["nama lengkap"]}`,
      bagian: bagianAyah,
      persentase: adaAnak ? "1/6" : "Sisa",
    });
    sisaHarta -= bagianAyah;
  }

  // 4. IBU
  if (ahliWaris.ibu && ahliWaris.ibu.data.agama?.toLowerCase() === "islam") {
    let bagianIbu;
    if (
      adaAnak ||
      ahliWaris.saudaraLakiLaki.length + ahliWaris.saudaraPerempuan.length >= 2
    ) {
      bagianIbu = totalHarta / 6; // 1/6 jika ada anak atau saudara 2+
    } else {
      bagianIbu = totalHarta / 3; // 1/3 jika tidak ada anak dan saudara < 2
    }

    hasil.push({
      ahli: "Ibu",
      nama: `${ahliWaris.ibu.data["nama lengkap"]} `,
      bagian: bagianIbu,
      persentase:
        adaAnak ||
        ahliWaris.saudaraLakiLaki.length + ahliWaris.saudaraPerempuan.length >=
          2
          ? "1/6"
          : "1/3",
    });
    sisaHarta -= bagianIbu;
  }

  // 5. ANAK-ANAK (Ashabah - mendapat sisa)
  const anakMuslim = [
    ...ahliWaris.anakLakiLaki.filter(
      (a) => a.data.agama?.toLowerCase() === "islam"
    ),
    ...ahliWaris.anakPerempuan.filter(
      (a) => a.data.agama?.toLowerCase() === "islam"
    ),
  ];

  if (anakMuslim.length > 0 && sisaHarta > 0) {
    // Hitung total porsi (laki-laki = 2, perempuan = 1)
    const totalPorsi =
      ahliWaris.anakLakiLaki.filter(
        (a) => a.data.agama?.toLowerCase() === "islam"
      ).length *
        2 +
      ahliWaris.anakPerempuan.filter(
        (a) => a.data.agama?.toLowerCase() === "islam"
      ).length *
        1;

    const nilaiPerPorsi = sisaHarta / totalPorsi;

    // Anak laki-laki
    ahliWaris.anakLakiLaki.forEach((anak) => {
      if (anak.data.agama?.toLowerCase() === "islam") {
        hasil.push({
          ahli: "Anak Laki-laki",
          nama: `${anak.data["nama lengkap"]} `,
          bagian: nilaiPerPorsi * 2,
          persentase: "2 bagian (Ashabah)",
        });
      }
    });

    // Anak perempuan
    ahliWaris.anakPerempuan.forEach((anak) => {
      if (anak.data.agama?.toLowerCase() === "islam") {
        hasil.push({
          ahli: "Anak Perempuan",
          nama: `${anak.data["nama lengkap"]} `,
          bagian: nilaiPerPorsi,
          persentase: "1 bagian (Ashabah)",
        });
      }
    });

    sisaHarta = 0;
  }

  // 6. SAUDARA (jika tidak ada anak dan ayah)
  if (!adaAnak && !ahliWaris.ayah && sisaHarta > 0) {
    const saudaraMuslim = [
      ...ahliWaris.saudaraLakiLaki.filter(
        (s) => s.data.agama?.toLowerCase() === "islam"
      ),
      ...ahliWaris.saudaraPerempuan.filter(
        (s) => s.data.agama?.toLowerCase() === "islam"
      ),
    ];

    if (saudaraMuslim.length > 0) {
      const totalPorsiSaudara =
        ahliWaris.saudaraLakiLaki.filter(
          (s) => s.data.agama?.toLowerCase() === "islam"
        ).length *
          2 +
        ahliWaris.saudaraPerempuan.filter(
          (s) => s.data.agama?.toLowerCase() === "islam"
        ).length *
          1;

      const nilaiPerPorsiSaudara = sisaHarta / totalPorsiSaudara;

      // Saudara laki-laki
      ahliWaris.saudaraLakiLaki.forEach((saudara) => {
        if (saudara.data.agama?.toLowerCase() === "islam") {
          hasil.push({
            ahli: "Saudara Laki-laki",
            nama: `${saudara.data["nama lengkap"]} `,
            bagian: nilaiPerPorsiSaudara * 2,
            persentase: "2 bagian (Ashabah)",
          });
        }
      });

      // Saudara perempuan
      ahliWaris.saudaraPerempuan.forEach((saudara) => {
        if (saudara.data.agama?.toLowerCase() === "islam") {
          hasil.push({
            ahli: "Saudara Perempuan",
            nama: `${saudara.data["nama lengkap"]} `,
            bagian: nilaiPerPorsiSaudara,
            persentase: "1 bagian (Ashabah)",
          });
        }
      });

      sisaHarta = 0;
    }
  }

  return hasil;
}

function tampilkanHasilWaris(hasilPembagian, totalHarta, almarhum) {
  const hasilDiv = document.getElementById("hasilWaris");

  let html = `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #333; margin-bottom: 10px;">Pembagian Waris</h3>
      <p><strong>Almarhum:</strong> ${almarhum.data["nama lengkap"]}</p>
      <p><strong>Total Harta:</strong> ${formatRupiah(totalHarta)}</p>
    </div>
  `;

  if (hasilPembagian.length === 0) {
    html += `<p style="color: red; text-align: center;">Tidak ada ahli waris yang berhak.</p>`;
  } else {
    html += `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Ahli Waris</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Nama</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Bagian</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Jumlah</th>
            </tr>
          </thead>
          <tbody>
    `;

    let totalTerbagi = 0;
    hasilPembagian.forEach((item) => {
      if (item.bagian) {
        totalTerbagi += item.bagian;
        html += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.ahli}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${
              item.nama || "-"
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${
              item.persentase
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatRupiah(
              item.bagian
            )}</td>
          </tr>
        `;
      } else {
        html += `
          <tr>
            <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: center; color: red;">
              ${item.keterangan}
            </td>
          </tr>
        `;
      }
    });

    html += `
          </tbody>
          <tfoot>
            <tr style="background-color: #f9f9f9; font-weight: bold;">
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total Terbagi:</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatRupiah(
                totalTerbagi
              )}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

    const sisaHarta = totalHarta - totalTerbagi;
    if (sisaHarta > 0) {
      html += `
        <div style="margin-top: 15px; padding: 10px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
          <strong>Sisa Harta:</strong> ${formatRupiah(sisaHarta)}
          <br><small>Sisa harta dapat diberikan kepada ahli waris terdekat atau untuk kepentingan umum.</small>
        </div>
      `;
    }
  }

  hasilDiv.innerHTML = html;
}

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

// Function untuk memperbarui data global
function updateGlobalData() {
  if (window.f3ChartInstance) {
    try {
      // Coba berbagai method untuk mendapatkan data terbaru
      if (typeof window.f3ChartInstance.data === "function") {
        window.familyTreeData = window.f3ChartInstance.data();
      } else if (typeof window.f3ChartInstance.getData === "function") {
        window.familyTreeData = window.f3ChartInstance.getData();
      }
    } catch (error) {
      console.log("Tidak dapat memperbarui data global:", error);
    }
  }
}

function desimalKePecahan(decimal, precision = 1e-6) {
  let numerator = 1;
  let denominator = 1;

  while (Math.abs(numerator / denominator - decimal) > precision) {
    if (numerator / denominator < decimal) {
      numerator++;
    } else {
      denominator++;
      numerator = Math.round(decimal * denominator);
    }
  }
  return `${numerator}/${denominator}`;
}
