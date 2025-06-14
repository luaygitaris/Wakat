create(data());

function create(data) {
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
    .setCardDisplay([["nama lengkap"], ["status"], ["agama"]])
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

  window.f3ChartInstance = f3Chart;
  window.showWarisCalculation = showWarisCalculation;

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
        "nama lengkap": "",
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
  setTimeout(() => {
    let container = document.getElementById("buttonContainer");

    if (!container) {
      container = document.createElement("div");
      container.id = "buttonContainer";
      container.style.cssText = `
        margin-top: 20px;
        text-align: center;
        padding: 20px;
      `;

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

    if (container && typeof container.appendChild === "function") {
      container.innerHTML = "";

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

      try {
        container.appendChild(btnWaris);
        container.appendChild(btnZakat);
        console.log("Tombol berhasil ditambahkan");
      } catch (error) {
        console.error("Error menambahkan tombol:", error);
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
  }, 1000);
}

function showWarisCalculation(f3Chart) {
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
      <button id="saveWaris" style="padding: 10px 20px; background: #16a34a; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">Simpan</button>
      <button id="closeModal" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Tutup</button>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  const selectAlmarhum = document.getElementById("selectAlmarhum");
  let allData = [];

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

    console.log("Data yang ditemukan:", allData);

    if (Array.isArray(allData)) {
      allData.forEach((person) => {
        if (person.data && person.data.status === "meninggal") {
          const option = document.createElement("option");
          option.value = person.id;
          option.textContent = `${person.data["nama lengkap"]}`;
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

  selectAlmarhum.addEventListener("change", (e) => {
    if (e.target.value) {
      hitungWarisFromSilsilah(f3Chart, e.target.value);
    }
  });

  document.getElementById("closeModal").onclick = () => {
    document.body.removeChild(modal);
  };

  document.getElementById("saveWaris").onclick = () => {
    if (window.lastWarisResult) {
      localStorage.setItem(
        "warisResult",
        JSON.stringify(window.lastWarisResult)
      );
      displaySavedWarisResult(window.lastWarisResult);
      document.body.removeChild(modal);
    } else {
      alert(
        "Tidak ada hasil warisan untuk disimpan. Silakan pilih almarhum terlebih dahulu."
      );
    }
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
}

function hitungWarisFromSilsilah(f3Chart, almarhumId) {
  let allData = [];

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
    allData = data();
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
      if (spouse && spouse.data.status === "hidup") {
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
      if (child && child.data.status === "hidup") {
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
      if (person.data.status === "hidup") {
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

  // 2. ISTRI
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
    // Tambahkan keterangan untuk istri non-Muslim
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

  // 3. AYAH
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

  // 4. IBU
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

  // 5. ANAK-ANAK
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
      // Tambahkan keterangan untuk anak non-Muslim jika tidak ada anak Muslim
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

  // 6. SAUDARA
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
      // Tambahkan keterangan untuk saudara non-Muslim jika tidak ada saudara Muslim
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

  el.innerHTML = html;
}

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
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

window.addEventListener("load", () => {
  const savedResult = localStorage.getItem("warisResult");
  if (savedResult) {
    try {
      const result = JSON.parse(savedResult);
      displaySavedWarisResult(result);
    } catch (error) {
      console.error("Error parsing saved waris result:", error);
    }
  }
});
