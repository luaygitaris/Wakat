function renderTabel() {
  const tableBody = document.getElementById("warisRiwayatTableBody");
  tableBody.innerHTML = "";

  const riwayat = JSON.parse(localStorage.getItem("riwayatWaris")) || [];

  riwayat.forEach((item, index) => {
    let namaAlmarhum = "Tidak diketahui";
    let jumlah = "Tidak diketahui";

    if (item.hasilWaris && item.hasilWaris.almarhum) {
      namaAlmarhum = item.hasilWaris.almarhum.data["nama lengkap"];
    }

    if (item.hasilWaris && typeof item.hasilWaris.totalHarta === "number") {
      jumlah = formatRupiah(item.hasilWaris.totalHarta);
    }

    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50";

    tr.innerHTML = `
      <td class="px-4 py-2">${index + 1}</td>
      <td class="px-4 py-2">${item.tanggal.split("T")[0]}</td>
      <td class="px-4 py-2">${namaAlmarhum}</td>
      <td class="px-4 py-2">${jumlah}</td>
      <td class="px-4 py-2 text-center">
        <button onclick="lihatRiwayat(${index})" class="bg-biru text-black px-2 py-1 hover:underline text-sm mr-2">Lihat</button>
        <button onclick="downloadPDF(${index})" class="bg-abu text-black px-2 py-1 hover:underline text-sm mr-2">Download PDF</button>
        <button onclick="hapusById(${index})" class="bg-red text-white px-2 py-1 hover:underline text-sm">Hapus</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

function renderFamilyTree(container, treeData) {
  // Hapus konten sebelumnya jika ada
  container.innerHTML = "";

  // Buat canvas untuk family tree
  const canvas = document.createElement("div");
  canvas.className = "f3";
  canvas.style.width = "100%";
  canvas.style.height = "600px";
  canvas.style.margin = "auto";
  canvas.style.backgroundColor = "rgb(33, 33, 33)";
  canvas.style.color = "#fff";
  canvas.style.overflow = "auto";
  container.appendChild(canvas);

  // Render family tree
  try {
    const f3Chart = f3
      .createChart(canvas, treeData)
      .setTransitionTime(100)
      .setCardXSpacing(250)
      .setCardYSpacing(150)
      .setSingleParentEmptyCard(true, { label: "ADD" })
      .setShowSiblingsOfMain(false)
      .setOrientationVertical();

    f3Chart
      .setCard(f3.CardHtml)
      .setCardDisplay([
        ["nama lengkap"],
        ["status(hidup/meninggal)"],
        ["agama"],
      ])
      .setMiniTree(true)
      .setStyle("imageRect")
      .setOnHoverPathToMain();

    f3Chart.updateTree({ initial: true });

    return f3Chart;
  } catch (error) {
    console.error("Error rendering family tree:", error);
    canvas.innerHTML = `<p class="text-red-500">Error rendering family tree: ${error.message}</p>`;
  }
}

function lihatRiwayat(index) {
  const riwayat = JSON.parse(localStorage.getItem("riwayatWaris")) || [];
  const item = riwayat[index];
  if (!item) return alert("Data tidak ditemukan!");

  const modal = document.createElement("div");
  modal.id = "riwayatModal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: white;
    padding: 25px;
    border-radius: 12px;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    position: relative;
  `;

  // Header modal
  modalContent.innerHTML = `
    <div class="flex justify-between items-center mb-6 pb-4 border-b">
      <h2 class="text-2xl font-bold text-gray-800">Detail Riwayat Waris</h2>
      <button id="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 class="text-xl font-semibold mb-4 text-gray-700">Silsilah Keluarga</h3>
        <div id="familyTreeContainer"></div>
      </div>
      <div>
        <h3 class="text-xl font-semibold mb-4 text-gray-700">Hasil Pembagian Waris</h3>
        <div id="hasilWarisContainer"></div>
      </div>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Render family tree
  const treeContainer = document.getElementById("familyTreeContainer");
  renderFamilyTree(treeContainer, item.familyTree);

  // Render hasil waris
  const hasilWarisContainer = document.getElementById("hasilWarisContainer");
  if (item.hasilWaris) {
    let html = `
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <p class="mb-2"><span class="font-semibold">Almarhum:</span> ${
          item.hasilWaris.almarhum.data["nama lengkap"]
        }</p>
        <p><span class="font-semibold">Total Harta:</span> ${formatRupiah(
          item.hasilWaris.totalHarta
        )}</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-700 border">
          <thead class="bg-gray-200 text-gray-800">
            <tr>
              <th class="px-4 py-2 border">Ahli Waris</th>
              <th class="px-4 py-2 border">Nama</th>
              <th class="px-4 py-2 border">Bagian</th>
              <th class="px-4 py-2 border">Jumlah</th>
            </tr>
          </thead>
          <tbody>
    `;

    item.hasilWaris.hasilPembagian.forEach((waris) => {
      html += `
        <tr class="bg-white border-b hover:bg-gray-50">
          <td class="px-4 py-2 border">${waris.ahli}</td>
          <td class="px-4 py-2 border">${waris.nama || "-"}</td>
          <td class="px-4 py-2 border text-center">${
            waris.persentase || "-"
          }</td>
          <td class="px-4 py-2 border text-right">${
            waris.bagian ? formatRupiah(waris.bagian) : "-"
          }</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    // Hitung total terbagi
    const totalTerbagi = item.hasilWaris.hasilPembagian.reduce(
      (total, waris) => {
        return total + (waris.bagian || 0);
      },
      0
    );

    // Tampilkan sisa harta jika ada
    const sisaHarta = item.hasilWaris.totalHarta - totalTerbagi;
    if (sisaHarta > 0) {
      html += `
        <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="font-semibold">Sisa Harta: ${formatRupiah(sisaHarta)}</p>
          <p class="text-sm text-gray-600 mt-1">Sisa harta dapat diberikan kepada ahli waris terdekat atau untuk kepentingan umum.</p>
        </div>
      `;
    }

    hasilWarisContainer.innerHTML = html;
  } else {
    hasilWarisContainer.innerHTML =
      '<p class="text-red-500">Data hasil waris tidak tersedia</p>';
  }

  // Event listener untuk tombol tutup
  document.getElementById("closeModal").onclick = () => {
    document.body.removeChild(modal);
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
}

// Fungsi lainnya tetap sama...

function downloadPDF(index) {
  const riwayat = JSON.parse(localStorage.getItem("riwayatWaris")) || [];
  const item = riwayat[index];
  if (!item) return alert("Data tidak ditemukan!");

  // Create a temporary container for rendering the family tree
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px"; // Off-screen
  tempContainer.style.width = "1200px"; // Fixed width for consistent rendering
  tempContainer.style.height = "800px"; // Fixed height
  document.body.appendChild(tempContainer);

  // Render the family tree into the temporary container
  try {
    renderFamilyTree(tempContainer, item.familyTree);
  } catch (error) {
    console.error("Error rendering family tree for PDF:", error);
    tempContainer.innerHTML = "<p>Error rendering family tree</p>";
  }

  // Use html2canvas to capture the rendered family tree as an image
  setTimeout(() => {
    html2canvas(tempContainer).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      document.body.removeChild(tempContainer); // Clean up

      // Initialize jsPDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const contentWidth = pageWidth - 2 * margin;

      // Header
      doc.setFontSize(18);
      doc.text("Detail Riwayat Waris", pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Tanggal: ${item.tanggal.split("T")[0]}`, pageWidth / 2, 22, {
        align: "center",
      });

      let y = 30;

      // Section 1: Informasi Almarhum
      doc.setFontSize(14);
      doc.text("Informasi Almarhum:", margin, y);
      y += 8;

      doc.setFontSize(10);
      if (item.hasilWaris?.almarhum) {
        const alm = item.hasilWaris.almarhum.data;
        doc.text(`Nama Lengkap: ${alm["nama lengkap"] || "-"}`, margin, y);
        y += 6;
        doc.text(`Jenis Kelamin: ${alm["jenis kelamin"] || "-"}`, margin, y);
        y += 6;
        doc.text(`Agama: ${alm["agama"] || "-"}`, margin, y);
        y += 6;
        doc.text(
          `Status Kewarisan: ${alm["status kewarisan"] || "-"}`,
          margin,
          y
        );
        y += 10;
      } else {
        doc.text("Data almarhum tidak tersedia", margin, y);
        y += 10;
      }

      // Section 2: Struktur Keluarga (Family Tree Image)
      doc.setFontSize(14);
      doc.text("Struktur Keluarga:", margin, y);
      y += 8;

      // Add the captured family tree image
      const imgWidth = 180; // mm, slightly less than contentWidth
      const aspectRatio = canvas.height / canvas.width;
      const imgHeight = imgWidth * aspectRatio;
      doc.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
      y += imgHeight + 10;

      // Section 3: Hasil Pembagian Waris
      doc.setFontSize(14);
      doc.text("Hasil Pembagian Waris:", margin, y);
      y += 8;

      if (item.hasilWaris) {
        doc.setFontSize(10);
        doc.text(
          `Total Harta: ${formatRupiah(item.hasilWaris.totalHarta)}`,
          margin,
          y
        );
        y += 10;

        // Tabel pembagian waris
        const headers = ["Ahli Waris", "Nama", "Bagian", "Jumlah"];
        const rows = item.hasilWaris.hasilPembagian.map((waris) => [
          waris.ahli,
          waris.nama || "-",
          waris.persentase || "-",
          waris.bagian ? formatRupiah(waris.bagian) : "-",
        ]);

        doc.autoTable({
          startY: y,
          head: [headers],
          body: rows,
          theme: "grid",
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
          },
          styles: {
            fontSize: 9,
            cellPadding: 2,
          },
          columnStyles: {
            3: { halign: "right" },
          },
        });

        y = doc.lastAutoTable.finalY + 5;

        // Sisa harta
        const totalTerbagi = item.hasilWaris.hasilPembagian.reduce(
          (sum, waris) => sum + (waris.bagian || 0),
          0
        );
        const sisaHarta = item.hasilWaris.totalHarta - totalTerbagi;

        if (sisaHarta > 0) {
          doc.setFontSize(10);
          doc.setTextColor(200, 0, 0);
          doc.text(`Sisa Harta: ${formatRupiah(sisaHarta)}`, margin, y);
          doc.setTextColor(0);
          doc.text(
            "Sisa harta dapat diberikan kepada ahli waris terdekat atau untuk kepentingan umum.",
            margin,
            y + 5
          );
        }
      } else {
        doc.text("Data hasil waris tidak tersedia", margin, y);
      }

      // Save the PDF
      doc.save(
        `riwayat_waris_${
          item.hasilWaris?.almarhum?.data?.["nama lengkap"] || "almarhum"
        }.pdf`
      );
    });
  }, 1000); // Delay to ensure family tree is rendered before capturing
}

// Ensure other functions like renderFamilyTree, formatRupiah, etc., remain defined elsewhere in your code.

function hapusById(index) {
  let riwayat = JSON.parse(localStorage.getItem("riwayatWaris")) || [];
  const item = riwayat[index];
  if (!item) return alert("Data tidak ditemukan!");

  const yakin = confirm(
    `Hapus data untuk "${item.hasilWaris.almarhum.data["nama lengkap"]}"?`
  );
  if (!yakin) return;

  riwayat.splice(index, 1);
  localStorage.setItem("riwayatWaris", JSON.stringify(riwayat));
  renderTabel();
}

function formatRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

window.addEventListener("DOMContentLoaded", () => {
  renderTabel();
});
