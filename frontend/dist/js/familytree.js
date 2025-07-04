const STORAGE_KEY = "myFamilyTree_" + getUserId();

let f3EditTree;

// Ambil dari localStorage, jika tidak ada pakai data() default
const savedData = localStorage.getItem(STORAGE_KEY);
const initialData = savedData ? JSON.parse(savedData) : data();

create(initialData);

function create(treeData) {
  const f3Chart = f3
    .createChart("#FamilyChart", treeData)
    .setTransitionTime(1000)
    .setCardXSpacing(250)
    .setCardYSpacing(150)
    .setSingleParentEmptyCard(true, { label: "ADD" })
    .setShowSiblingsOfMain(false)
    .setOrientationVertical();

  const f3Card = f3Chart
    .setCard(f3.CardHtml)
    .setCardDisplay([
      ["nama lengkap"],
      ["status(hidup/meninggal)"],
      ["agama"],
      ["waris"],
    ])
    .setMiniTree(true)
    .setStyle("imageRect")
    .setOnHoverPathToMain();

  f3EditTree = f3Chart
    .editTree()
    .fixed(true)
    .setFields(["nama lengkap", "status(hidup/meninggal)", "agama"])
    .setEditFirst(true)
    .setCardClickOpen(f3Card)
    .setOnChange(() => {
      const updated = f3EditTree.getStoreDataCopy();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log("✅ Data disimpan ke localStorage:", updated);
    });
  setTimeout(() => {
    const observer = new MutationObserver(() => {
      convertInputsToCustomFields(); // jalankan setiap form muncul
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    observer.observe(targetNode, config);
  }, 500);

  f3Chart.updateTree({ initial: true });
  f3EditTree.open(f3Chart.getMainDatum());

  window.f3ChartInstance = f3Chart;
  window.showWarisCalculation = showWarisCalculation;

  addButtons(f3Chart);

  return f3Chart;
}

function convertInputsToCustomFields() {
  const interval = setInterval(() => {
    const inputAgama = document.querySelector('input[name="agama"]');
    const statusField = document.querySelector(
      'input[name="status(hidup/meninggal)"], select[name="status(hidup/meninggal)"]'
    );

    // === STATUS → Radio Button ===
    if (statusField && !statusField.closest('div[data-converted="status"]')) {
      const savedStatus =
        localStorage.getItem("status_hidup_meninggal") ||
        (statusField.tagName === "INPUT"
          ? statusField.value
          : statusField.options[statusField.selectedIndex]?.value || "hidup");

      const container = document.createElement("div");
      container.className = "flex gap-4 items-center";
      container.dataset.converted = "status";

      // Radio: Hidup
      const hidupDiv = document.createElement("div");
      hidupDiv.className = "flex items-center";
      const radioHidup = document.createElement("input");
      radioHidup.type = "radio";
      radioHidup.name = statusField.name;
      radioHidup.value = "hidup";
      radioHidup.id = "status-hidup-" + Math.random().toString(36).substring(2);
      radioHidup.className = "form-radio text-blue-600 mr-2";
      if (savedStatus === "hidup") radioHidup.checked = true;
      const labelHidup = document.createElement("label");
      labelHidup.htmlFor = radioHidup.id;
      labelHidup.className = "text-sm";
      labelHidup.textContent = "Hidup";
      hidupDiv.appendChild(radioHidup);
      hidupDiv.appendChild(labelHidup);

      // Radio: Meninggal
      const meninggalDiv = document.createElement("div");
      meninggalDiv.className = "flex items-center";
      const radioMeninggal = document.createElement("input");
      radioMeninggal.type = "radio";
      radioMeninggal.name = statusField.name;
      radioMeninggal.value = "meninggal";
      radioMeninggal.id =
        "status-meninggal-" + Math.random().toString(36).substring(2);
      radioMeninggal.className = "form-radio text-red-600 mr-2";
      if (savedStatus === "meninggal") radioMeninggal.checked = true;
      const labelMeninggal = document.createElement("label");
      labelMeninggal.htmlFor = radioMeninggal.id;
      labelMeninggal.className = "text-sm";
      labelMeninggal.textContent = "Meninggal";
      meninggalDiv.appendChild(radioMeninggal);
      meninggalDiv.appendChild(labelMeninggal);

      container.appendChild(hidupDiv);
      container.appendChild(meninggalDiv);

      // Ganti statusField dengan radio container
      statusField.replaceWith(container);

      // === Fungsi toggle input harta
      const toggleHartaField = () => {
        const formGroup =
          container.closest(".f3-form") || container.parentElement;
        if (!formGroup) return;

        // Hapus bagian harta (jika ada) dulu
        const existingHarta = formGroup.querySelector(".dynamic-harta-group");
        if (existingHarta) existingHarta.remove();

        const showHarta =
          container.querySelector('input[type="radio"]:checked')?.value ===
          "meninggal";

        // Buat ulang hanya jika status "meninggal"
        if (showHarta) {
          const hartaGroup = document.createElement("div");
          hartaGroup.className = "dynamic-harta-group mt-2";

          const label = document.createElement("label");
          label.textContent = "Harta (jika meninggal)";
          label.className = "block text-sm font-medium text-white";

          const input = document.createElement("input");
          input.type = "text";
          input.name = "harta";
          input.placeholder = "Jumlah harta";
          input.className = "border px-3 py-2 rounded w-full text-sm mt-1";
          input.inputMode = "numeric";

          input.addEventListener("input", () => {
            const raw = input.value.replace(/\D/g, "");
            const formatted = new Intl.NumberFormat("id-ID").format(raw);
            input.value = raw ? `Rp ${formatted}` : "";
            localStorage.setItem("harta_terakhir", raw);
          });

          const lastHarta = localStorage.getItem("harta_terakhir");
          if (lastHarta)
            input.value = `Rp ${new Intl.NumberFormat("id-ID").format(
              lastHarta
            )}`;

          hartaGroup.appendChild(label);
          hartaGroup.appendChild(input);
          formGroup.appendChild(hartaGroup);
        }

        // 🔁 Tambahkan tombol Hitung hanya jika ada anggota "meninggal"
        let btnHitung = formGroup.querySelector(".btn-hitung-waris");
        // Cek apakah ada anggota familytree yang statusnya "meninggal"
        let adaMeninggal = false;
        try {
          const STORAGE_KEY = "myFamilyTree_" + getUserId();
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const allData = JSON.parse(saved);
            adaMeninggal = allData.some(
              (p) =>
                String(p.data["status(hidup/meninggal)"]).toLowerCase() === "meninggal"
            );
          }
        } catch (e) {
          adaMeninggal = false;
        }
        if (!btnHitung && adaMeninggal) {
          btnHitung = document.createElement("button");
          btnHitung.type = "button";
          btnHitung.className =
            "btn-hitung-waris bg-white text-black px-4 py-2 rounded shadow font-semibold";
          btnHitung.innerText = "Hitung";
          btnHitung.onclick = function () {
            if (window.f3ChartInstance) {
              showWarisCalculation(window.f3ChartInstance);
              setTimeout(() => {
                location.reload();
              }, 300);
            } else {
              alert("Family tree belum siap.");
            }
          };
          formGroup.appendChild(btnHitung);
        } else if (btnHitung && !adaMeninggal) {
          // Jika tidak ada yang meninggal, sembunyikan tombol Hitung
          btnHitung.style.display = "none";
        } else if (btnHitung && adaMeninggal) {
          btnHitung.style.display = "";
        }
      };

      // Pasang listener pada radio
      container.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener("change", () => {
          localStorage.setItem("status_hidup_meninggal", radio.value);
          toggleHartaField();
        });
      });

      // Jalankan awal setelah radio muncul
      setTimeout(toggleHartaField, 0);
    }

    // === AGAMA → Dropdown ===
    if (
      inputAgama &&
      !document.querySelector('select[data-converted="agama"]')
    ) {
      const savedAgama =
        localStorage.getItem("agama_terakhir") || inputAgama.value;

      const select = document.createElement("select");
      select.name = inputAgama.name;
      select.id = inputAgama.id || "agama";
      select.className =
        "border px-3 py-2 rounded w-full text-sm text-gray-700";
      select.dataset.converted = "agama";

      ["Islam", "Non-Islam"].forEach((agama) => {
        const option = document.createElement("option");
        option.value = agama;
        option.textContent = agama;
        if (savedAgama.toLowerCase() === agama.toLowerCase()) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      inputAgama.parentNode.replaceChild(select, inputAgama);

      select.addEventListener("change", () => {
        localStorage.setItem("agama_terakhir", select.value);
      });
    }

    // === STOP interval setelah sukses
    const statusDone = document.querySelector('div[data-converted="status"]');
    const agamaDone = document.querySelector('select[data-converted="agama"]');

    if (statusDone && agamaDone) {
      clearInterval(interval);
      console.log("✅ Konversi form selesai.");
    }
  }, 300);
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
        "nama lengkap": "Budi Santoso",
        "status(hidup/meninggal)": "hidup",
        agama: "Islam",
        harta: 100000,
        avatar:
          "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
        gender: "M",
      },
    },
  ];
}

// Reset hanya localStorage + reload
window.resetTree = function () {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key.startsWith("myFamilyTree_") ||
      key.startsWith("warisResult_") ||
      key.startsWith("riwayatWaris_")
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  alert("Seluruh data pengguna telah dihapus.");
  location.reload();
};

function getUserId() {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);

      const id = user.id || user.user_id || user.ID || user.Id || user.ID_user;

      if (typeof id === "number") return String(id); // convert ke string
      if (typeof id === "string" && id.trim()) return id.trim();
    }
    console.warn("User ID tidak ditemukan, menggunakan fallback.");
  } catch (e) {
    console.error("Gagal mem-parsing user:", e);
  }
  return "guest";
}
// Biarkan tombol submit pada familytree tetap menjadi submit (tidak diubah lagi)

function addButtons(f3Chart) {
  document.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("tombol");

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

    const btnReset = document.createElement("button");
    btnReset.id = "resetFamilyTree";
    btnReset.textContent = "Reset Data";
    btnReset.style.cssText = `
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
    btnReset.onmouseover = () => {
      btnReset.style.backgroundColor = "#15803d";
      btnReset.style.transform = "translateY(-1px)";
    };
    btnReset.onmouseout = () => {
      btnReset.style.backgroundColor = "#16a34a";
      btnReset.style.transform = "translateY(0)";
    };
    btnReset.onclick = () => {
      if (
        confirm(
          "Apakah Anda yakin ingin mereset semua data termasuk hasil waris dan riwayat?"
        )
      ) {
        window.resetTree();
        alert("Seluruh data telah direset.");
      }
    };

    // const btnSaveTree = document.createElement("button");
    // btnSaveTree.id = "saveFamilyTree";
    // btnSaveTree.textContent = "Simpan Silsilah Keluarga";
    // btnSaveTree.style.cssText = `
    //   margin-left: 10px;
    //   padding: 12px 24px;
    //   background-color: #f59e0b;
    //   color: white;
    //   border: none;
    //   border-radius: 8px;
    //   cursor: pointer;
    //   font-weight: 500;
    //   box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    //   transition: all 0.2s ease;
    // `;
    // btnSaveTree.onmouseover = () => {
    //   btnSaveTree.style.backgroundColor = "#d97706";
    //   btnSaveTree.style.transform = "translateY(-1px)";
    // };
    // btnSaveTree.onmouseout = () => {
    //   btnSaveTree.style.backgroundColor = "#f59e0b";
    //   btnSaveTree.style.transform = "translateY(0)";
    // };
    // btnSaveTree.onclick = () => {
    //   saveCurrentFamilyTree();
    // };

    try {
      container.appendChild(btnWaris);
      container.appendChild(btnReset);
      container.appendChild(btnSaveTree);
      console.log("Tombol berhasil ditambahkan ke container");
    } catch (error) {
      console.error("Error menambahkan tombol:", error);
      container.innerHTML = `
       
        <button id="calculateInheritance" onclick="showWarisCalculation(window.f3ChartInstance)" 
                style="margin-right: 10px; padding: 12px 24px; background-color: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          Hitung Warisan
        </button>
        <button id="resetFamilyTree" onclick="resetTree()" 
                style="margin-left: 10px; padding: 12px 24px; background-color: #16a34a; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          Reset Silsilah Keluarga
        </button>
       
      `;
    }
  });
}

window.addEventListener("load", () => {
  const savedResult = localStorage.getItem("warisResult_" + getUserId());
  if (savedResult) {
    try {
      const result = JSON.parse(savedResult);
      displaySavedWarisResult(result);
    } catch (error) {
      console.error("Error parsing saved waris result:", error);
    }
  }

  // Panggil render riwayat langsung di halaman
  if (typeof renderTabel === "function") renderTabel();
});

// === MODIFIKASI: tampilkan hasil waris langsung di form ===
function showWarisCalculation(f3Chart) {
  console.log("✅ Fungsi showWarisCalculation dipanggil");

  const STORAGE_KEY = "myFamilyTree_" + getUserId();
  const saved = localStorage.getItem(STORAGE_KEY);
  const allData = saved ? JSON.parse(saved) : [];

  const almarhum = allData.find(
    (p) =>
      String(p.data["status(hidup/meninggal)"]).toLowerCase() === "meninggal"
  );

  if (!almarhum) {
    alert("Pilih almarhum terlebih dahulu!");
    return;
  }

  const totalHarta = parseFloat(
    (typeof almarhum.data.harta === "string"
      ? almarhum.data.harta.replace(/[^\d]/g, "")
      : almarhum.data.harta) || 0
  );

  if (!totalHarta || isNaN(totalHarta)) {
    alert("Harta belum diisi atau tidak valid.");
    return;
  }

  const ahliWaris = identifikasiAhliWaris(allData, almarhum);
  const hasilPembagian = hitungPembagianWaris(totalHarta, ahliWaris, almarhum);
  window.lastWarisResult = { hasilPembagian, totalHarta, almarhum };
  window.currentFamilyTree = allData;

  // ✅ Buat map ID → Warisan + Keterangan
  const mapWarisan = {};
  hasilPembagian.forEach((item) => {
    const orang = allData.find((o) => o.data["nama lengkap"] === item.nama);
    if (orang) {
      mapWarisan[orang.id] = {
        bagian: item.bagian,
        keterangan: `${item.persentase || ""}${
          item.catatan ? " (" + item.catatan + ")" : ""
        }`.trim(),
      };
    }
  });

  // ✅ Masukkan ke data.waris → multi-baris
  allData.forEach((orang) => {
    const map = mapWarisan[orang.id];
    if (map) {
      orang.data.waris = `${map.keterangan}<br/>${formatRupiah(map.bagian)}`;
    } else {
      delete orang.data.waris;
    }
  });

  // ✅ Simpan dan update tampilan
  // ✅ Simpan dan update tampilan secara paksa
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  f3Chart.updateTree([]); // Kosongkan dulu
  f3Chart.updateTree(allData); // Render ulang

  // ✅ Simpan ke riwayat otomatis
  if (typeof simpanKeRiwayat === "function") {
    simpanKeRiwayat(window.lastWarisResult, allData);
    if (typeof renderTabel === "function") renderTabel(); // update tabel
  }

  f3Chart.updateTree([]);
  f3Chart.updateTree(allData);

  const f3Card = f3Chart
    .setCard(f3.CardHtml)
    .setCardDisplay([
      ["nama lengkap"],
      ["status(hidup/meninggal)"],
      ["agama"],
      ["waris"],
    ]);

  // ⬇️ Tambahkan blok ini
  if (window.f3ChartInstance) {
    f3EditTree = window.f3ChartInstance
      .editTree()
      .fixed(true)
      .setFields(["nama lengkap", "status(hidup/meninggal)", "agama"])
      .setEditFirst(true)
      .setCardClickOpen(f3Chart.getCard())
      .setOnChange(() => {
        const updated = f3EditTree.getStoreDataCopy();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log("✅ Data disimpan ke localStorage:", updated);
      });

    f3EditTree.open(f3Chart.getMainDatum());
  }

  setTimeout(() => {
    f3Chart.updateTree([]);
    f3Chart.updateTree(allData);
  }, 50); // 50 ms delay
}

function formatRupiah(value) {
  let number = parseFloat(
    typeof value === "string" ? value.replace(/[^0-9.-]/g, "") : value
  );

  if (!isFinite(number) || isNaN(number)) return "Rp 0";

  return (
    "Rp " +
    Math.round(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

// Tambahkan renderTabel jika tersedia dari riwazat.js
window.renderTabel =
  window.renderTabel ||
  function () {
    console.warn("renderTabel belum tersedia saat inisialisasi.");
  };

function hitungWarisFromSilsilah(almarhumId) {
  // Selalu ambil data dari localStorage agar data almarhum & harta selalu akurat
  let allData = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      allData = JSON.parse(saved);
    }
  } catch (e) {
    allData = [];
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

  let totalHarta = almarhum.data.harta;
  if (typeof totalHarta !== "string" && typeof totalHarta !== "number") {
    totalHarta = "";
  }
  if (typeof totalHarta === "string")
    totalHarta = totalHarta.replace(/[^0-9.]/g, "");
  totalHarta = parseFloat(totalHarta);

  if (!totalHarta || isNaN(totalHarta) || totalHarta <= 0) {
    document.getElementById("hasilWaris").innerHTML = `
    <div style="color: red; text-align: center;">
      <p>Harta almarhum belum diinput atau bernilai 0.</p>
      <p>Silakan edit data almarhum terlebih dahulu.</p>
    </div>
  `;
    return;
  }

  const ahliWaris = identifikasiAhliWaris(allData, almarhum);
  const hasilPembagian = hitungPembagianWaris(totalHarta, ahliWaris, almarhum);
  window.lastWarisResult = { hasilPembagian, totalHarta, almarhum };
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

  if (almarhum.rels.spouses) {
    almarhum.rels.spouses.forEach((spouseId) => {
      const spouse = allData.find((p) => p.id === spouseId);
      if (
        spouse &&
        String(spouse.data["status(hidup/meninggal)"]).toLowerCase() === "hidup"
      ) {
        if (spouse.data.gender === "M") {
          ahliWaris.suami.push(spouse);
        } else {
          ahliWaris.istri.push(spouse);
        }
      }
    });
  }

  if (almarhum.rels.children) {
    almarhum.rels.children.forEach((childId) => {
      const child = allData.find((p) => p.id === childId);
      if (
        child &&
        String(child.data["status(hidup/meninggal)"]).toLowerCase() === "hidup"
      ) {
        if (child.data.gender === "M") {
          ahliWaris.anakLakiLaki.push(child);
        } else {
          ahliWaris.anakPerempuan.push(child);
        }
      }
    });
  }

  allData.forEach((person) => {
    if (person.rels.children && person.rels.children.includes(almarhum.id)) {
      if (
        String(person.data["status(hidup/meninggal)"]).toLowerCase() === "hidup"
      ) {
        if (person.data.gender === "M") {
          ahliWaris.ayah = person;
        } else {
          ahliWaris.ibu = person;
        }
      }
    }
  });

  if (ahliWaris.ayah || ahliWaris.ibu) {
    const orangTua = ahliWaris.ayah || ahliWaris.ibu;
    if (orangTua.rels.children) {
      orangTua.rels.children.forEach((siblingId) => {
        if (siblingId !== almarhum.id) {
          const sibling = allData.find((p) => p.id === siblingId);
          if (
            sibling &&
            String(sibling.data["status(hidup/meninggal)"]).toLowerCase() ===
              "hidup"
          ) {
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

  if (ahliWaris.suami.length > 0) {
    const suami = ahliWaris.suami[0];
    if (suami.data.agama?.toLowerCase() === "islam") {
      const bagian = adaAnak ? totalHarta / 4 : totalHarta / 2;
      hasil.push({
        ahli: "Suami",
        nama: `${suami.data["nama lengkap"]}`,
        bagian: bagian,
        persentase: adaAnak ? "1/4" : "1/2",
      });
      sisaHarta -= bagian;
    } else {
      hasil.push({
        ahli: "Suami",
        nama: `${suami.data["nama lengkap"]}`,
        bagian: 0,
        persentase: "-",
        keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
      });
    }
  }

  if (ahliWaris.istri.length > 0) {
    const istriMuslim = ahliWaris.istri.filter(
      (istri) => istri.data.agama?.toLowerCase() === "islam"
    );
    if (istriMuslim.length > 0) {
      const bagianTotal = adaAnak ? totalHarta / 8 : totalHarta / 4;
      const bagianPerIstri = bagianTotal / istriMuslim.length;
      istriMuslim.forEach((istri) => {
        hasil.push({
          ahli: "Istri",
          nama: `${istri.data["nama lengkap"]}`,
          bagian: bagianPerIstri,
          persentase: adaAnak
            ? `1/${8 * istriMuslim.length}`
            : `1/${4 * istriMuslim.length}`,
        });
      });
      sisaHarta -= bagianTotal;
    }
    ahliWaris.istri
      .filter((istri) => istri.data.agama?.toLowerCase() !== "islam")
      .forEach((istri) => {
        hasil.push({
          ahli: "Istri",
          nama: `${istri.data["nama lengkap"]}`,
          bagian: 0,
          persentase: "-",
          keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
        });
      });
  }

  if (ahliWaris.ayah) {
    if (ahliWaris.ayah.data.agama?.toLowerCase() === "islam") {
      let bagianAyah;
      if (adaAnak) {
        bagianAyah = totalHarta / 6;
      } else {
        bagianAyah = ahliWaris.ibu ? sisaHarta * (2 / 3) : sisaHarta;
      }
      hasil.push({
        ahli: "Ayah",
        nama: `${ahliWaris.ayah.data["nama lengkap"]}`,
        bagian: bagianAyah,
        persentase: adaAnak ? "1/6" : "Sisa",
      });
      sisaHarta -= bagianAyah;
    } else {
      hasil.push({
        ahli: "Ayah",
        nama: `${ahliWaris.ayah.data["nama lengkap"]}`,
        bagian: 0,
        persentase: "-",
        keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
      });
    }
  }

  if (ahliWaris.ibu) {
    if (ahliWaris.ibu.data.agama?.toLowerCase() === "islam") {
      let bagianIbu;
      if (
        adaAnak ||
        ahliWaris.saudaraLakiLaki.length + ahliWaris.saudaraPerempuan.length >=
          2
      ) {
        bagianIbu = totalHarta / 6;
      } else {
        bagianIbu = totalHarta / 3;
      }
      hasil.push({
        ahli: "Ibu",
        nama: `${ahliWaris.ibu.data["nama lengkap"]}`,
        bagian: bagianIbu,
        persentase:
          adaAnak ||
          ahliWaris.saudaraLakiLaki.length +
            ahliWaris.saudaraPerempuan.length >=
            2
            ? "1/6"
            : "1/3",
      });
      sisaHarta -= bagianIbu;
    } else {
      hasil.push({
        ahli: "Ibu",
        nama: `${ahliWaris.ibu.data["nama lengkap"]}`,
        bagian: 0,
        persentase: "-",
        keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
      });
    }
  }

  if (ahliWaris.anakLakiLaki.length > 0 || ahliWaris.anakPerempuan.length > 0) {
    const anakMuslim = [
      ...ahliWaris.anakLakiLaki.filter(
        (a) => a.data.agama?.toLowerCase() === "islam"
      ),
      ...ahliWaris.anakPerempuan.filter(
        (a) => a.data.agama?.toLowerCase() === "islam"
      ),
    ];
    if (anakMuslim.length > 0 && sisaHarta > 0) {
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

      ahliWaris.anakLakiLaki.forEach((anak) => {
        if (anak.data.agama?.toLowerCase() === "islam") {
          hasil.push({
            ahli: "Anak Laki-laki",
            nama: `${anak.data["nama lengkap"]}`,
            bagian: nilaiPerPorsi * 2,
            persentase: "2 bagian (Ashabah)",
          });
        } else {
          hasil.push({
            ahli: "Anak Laki-laki",
            nama: `${anak.data["nama lengkap"]}`,
            bagian: 0,
            persentase: "-",
            keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
          });
        }
      });

      ahliWaris.anakPerempuan.forEach((anak) => {
        if (anak.data.agama?.toLowerCase() === "islam") {
          hasil.push({
            ahli: "Anak Perempuan",
            nama: `${anak.data["nama lengkap"]}`,
            bagian: nilaiPerPorsi,
            persentase: "1 bagian (Ashabah)",
          });
        } else {
          hasil.push({
            ahli: "Anak Perempuan",
            nama: `${anak.data["nama lengkap"]}`,
            bagian: 0,
            persentase: "-",
            keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
          });
        }
      });

      sisaHarta = 0;
    } else {
      ahliWaris.anakLakiLaki
        .filter((a) => a.data.agama?.toLowerCase() !== "islam")
        .forEach((anak) => {
          hasil.push({
            ahli: "Anak Laki-laki",
            nama: `${anak.data["nama lengkap"]}`,
            bagian: 0,
            persentase: "-",
            keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
          });
        });
      ahliWaris.anakPerempuan
        .filter((a) => a.data.agama?.toLowerCase() !== "islam")
        .forEach((anak) => {
          hasil.push({
            ahli: "Anak Perempuan",
            nama: `${anak.data["nama lengkap"]}`,
            bagian: 0,
            persentase: "-",
            keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
          });
        });
    }
  }

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

      ahliWaris.saudaraLakiLaki.forEach((saudara) => {
        if (saudara.data.agama?.toLowerCase() === "islam") {
          hasil.push({
            ahli: "Saudara Laki-laki",
            nama: `${saudara.data["nama lengkap"]}`,
            bagian: nilaiPerPorsiSaudara * 2,
            persentase: "2 bagian (Ashabah)",
          });
        } else {
          hasil.push({
            ahli: "Saudara Laki-laki",
            nama: `${saudara.data["nama lengkap"]}`,
            bagian: 0,
            persentase: "-",
            keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
          });
        }
      });

      ahliWaris.saudaraPerempuan.forEach((saudara) => {
        if (saudara.data.agama?.toLowerCase() === "islam") {
          hasil.push({
            ahli: "Saudara Perempuan",
            nama: `${saudara.data["nama lengkap"]}`,
            bagian: nilaiPerPorsiSaudara,
            persentase: "1 bagian (Ashabah)",
          });
        } else {
          hasil.push({
            ahli: "Saudara Perempuan",
            nama: `${saudara.data["nama lengkap"]}`,
            bagian: 0,
            persentase: "-",
            keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
          });
        }
      });

      sisaHarta = 0;
    } else {
      ahliWaris.saudaraLakiLaki
        .filter((s) => s.data.agama?.toLowerCase() !== "islam")
        .forEach((saudara) => {
          hasil.push({
            ahli: "Saudara Laki-laki",
            nama: `${saudara.data["nama lengkap"]}`,
            bagian: 0,
            persentase: "-",
            keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
          });
        });
      ahliWaris.saudaraPerempuan
        .filter((s) => s.data.agama?.toLowerCase() !== "islam")
        .forEach((saudara) => {
          hasil.push({
            ahli: "Saudara Perempuan",
            nama: `${saudara.data["nama lengkap"]}`,
            bagian: 0,
            persentase: "-",
            keterangan: "Tidak mendapatkan warisan karena bukan beragama Islam",
          });
        });
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

function displaySavedWarisResult({ hasilPembagian, totalHarta, almarhum }) {
  const el = document.getElementById("hasil");
  if (!el) {
    console.error("Element with id 'hasil' not found.");
    return;
  }

  let html = `
      <h3 class="font-bold text-lg mb-2">Hasil Pembagian Waris:</h3>
      <p><strong>Almarhum:</strong> ${almarhum.data["nama lengkap"]}</p>
      <p><strong>Total Harta:</strong> ${formatRupiah(totalHarta)}</p>
      <div class="overflow-x-auto mt-4">
        <table class="w-full text-sm text-left text-gray-700 border text-center">
          <thead class="bg-gray-200 text-gray-800">
            <tr>
              <th class="px-4 py-2 border">Ahli Waris</th>
              <th class="px-4 py-2 border">Nama</th>
              <th class="px-4 py-2 border">Bagian Per Orang</th>
              <th class="px-4 py-2 border">Total Perolehan</th>
              <th class="px-4 py-2 border">Keterangan</th>
            </tr>
          </thead>
          <tbody>
  `;

  let totalTerbagi = 0;
  hasilPembagian.forEach((item) => {
    if (item.bagian) {
      totalTerbagi += item.bagian;
      html += `
        <tr class="bg-white border-b">
          <td class="px-4 py-2 border">${item.ahli}</td>
          <td class="px-4 py-2 border">${item.nama || "-"}</td>
          <td class="px-4 py-2 border">${item.persentase}</td>
          <td class="px-4 py-2 border">${formatRupiah(item.bagian)}</td>
          <td class="px-4 py-2 border">-</td>
        </tr>
      `;
    } else {
      html += `
        <tr class="bg-white border-b">
          <td class="px-4 py-2 border">${item.ahli}</td>
          <td class="px-4 py-2 border">${item.nama || "-"}</td>
          <td class="px-4 py-2 border">-</td>
          <td class="px-4 py-2 border">-</td>
          <td class="px-4 py-2 border">${item.keterangan}</td>
        </tr>
      `;
    }
  });

  html += `
          </tbody>
          <tfoot>
            <tr class="bg-gray-100 font-bold">
              <td colspan="3" class="px-4 py-2 border text-right">Total Terbagi:</td>
              <td class="px-4 py-2 border">${formatRupiah(totalTerbagi)}</td>
              <td class="px-4 py-2 border">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
  `;

  const sisaHarta = totalHarta - totalTerbagi;
  if (sisaHarta > 0) {
    html += `
      <div class="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
        <strong>Sisa Harta:</strong> ${formatRupiah(sisaHarta)}
        <br><small>Sisa harta dapat diberikan kepada ahli waris terdekat atau untuk kepentingan umum.</small>
      </div>
    `;
  }

  // Tambahkan tombol simpan ke riwayat
  html += `
    <div class="mt-4 flex flex-col items-center">
      <button id="btnSimpanRiwayatWaris" style="padding: 10px 24px; background: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 500; margin-bottom: 10px; cursor: pointer;">Simpan ke Riwayat</button>
      <small>Data silsilah keluarga dan hasil waris akan disimpan ke riwayat dengan nama yang Anda tentukan.</small>
    </div>
  `;

  el.innerHTML = html;

  // Event handler tombol simpan ke riwayat
  const btnSimpan = document.getElementById("btnSimpanRiwayatWaris");
  if (btnSimpan) {
    btnSimpan.onclick = function () {
      let nama = prompt(
        "Masukkan nama riwayat waris (misal: Waris Budi 2025):"
      );
      if (!nama || !nama.trim()) {
        alert("Nama riwayat tidak boleh kosong!");
        return;
      }

      // Ambil data familytree terbaru
      let familyTreeData = null;
      try {
        if (
          window.f3ChartInstance &&
          typeof window.f3ChartInstance.getChartData === "function"
        ) {
          familyTreeData = window.f3ChartInstance.getChartData();
        } else {
          const STORAGE_KEY = "myFamilyTree_" + getUserId();
          const saved = localStorage.getItem(STORAGE_KEY);
          familyTreeData = saved ? JSON.parse(saved) : null;
        }
      } catch (e) {
        familyTreeData = null;
      }

      if (!familyTreeData) {
        alert("Gagal mengambil data silsilah keluarga.");
        return;
      }

      // Ambil riwayat lama
      let riwayat = [];
      try {
        const old = localStorage.getItem("riwayatWaris_" + getUserId());
        riwayat = old ? JSON.parse(old) : [];
      } catch (e) {
        riwayat = [];
      }

      // Simpan data baru
      riwayat.push({
        nama: nama.trim(),
        tanggal: new Date().toISOString(),
        familyTree: familyTreeData,
        hasilWaris: { hasilPembagian, totalHarta, almarhum },
      });

      localStorage.setItem(
        "riwayatWaris_" + getUserId(),
        JSON.stringify(riwayat)
      );

      alert("Berhasil disimpan ke riwayat waris!");

      // ⬅️ Tambahkan baris ini agar langsung muncul di halaman riwayat jika ada
      if (typeof renderTabel === "function") {
        renderTabel();
      }
    };
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

function updateGlobalData() {
  if (window.f3ChartInstance) {
    try {
      // Perbarui chart sebelum mengambil data
      window.f3ChartInstance.updateTree();
      if (typeof window.f3ChartInstance.getChartData === "function") {
        window.saveFamilyTreeData = window.f3ChartInstance.getChartData();
      } else if (typeof window.f3ChartInstance.data === "function") {
        window.saveFamilyTreeData = window.f3ChartInstance.data();
      } else if (typeof window.f3ChartInstance.getData === "function") {
        window.saveFamilyTreeData = window.f3ChartInstance.getData();
      } else if (window.f3ChartInstance._data) {
        window.saveFamilyTreeData = window.f3ChartInstance._data;
      } else {
        console.warn(
          "Tidak ada metode pengambilan data, mempertahankan window.saveFamilyTreeData"
        );
        window.saveFamilyTreeData = window.saveFamilyTreeData || data();
      }
      if (!validateFamilyTreeData(window.saveFamilyTreeData)) {
        console.error("Invalid global data, resetting to default");
        window.saveFamilyTreeData = data();
      }
    } catch (error) {
      console.error("Tidak dapat memperbarui data global:", error);
      window.saveFamilyTreeData = window.saveFamilyTreeData || data();
    }
  } else {
    console.error("f3ChartInstance belum diinisialisasi");
    window.saveFamilyTreeData = window.saveFamilyTreeData || data();
  }
}

window.addEventListener("load", () => {
  const savedResult = localStorage.getItem("warisResult_" + getUserId());
  if (savedResult) {
    try {
      const result = JSON.parse(savedResult);
      displaySavedWarisResult(result);
    } catch (error) {
      console.error("Error parsing saved waris result:", error);
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const oldInput = document.querySelector(
    'input[name="status(hidup/meninggal)"]'
  );

  if (oldInput) {
    // Ambil nilai terakhir yang tersimpan (jika ada)
    const savedStatus =
      localStorage.getItem("status_hidup_meninggal") || oldInput.value;

    // Buat elemen select
    const select = document.createElement("select");
    select.name = oldInput.name;
    select.id = oldInput.id || "status";

    select.innerHTML = `
      <option value="hidup" ${
        savedStatus === "hidup" ? "selected" : ""
      }>hidup</option>
      <option value="meninggal" ${
        savedStatus === "meninggal" ? "selected" : ""
      }>meninggal</option>
    `;

    // Ganti input dengan select
    oldInput.parentNode.replaceChild(select, oldInput);

    // Simpan perubahan jika pengguna mengganti isi dropdown
    select.addEventListener("change", () => {
      localStorage.setItem("status_hidup_meninggal", select.value);
    });
  }
});
