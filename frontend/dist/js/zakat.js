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
pemasukanInput.addEventListener("input", updatePenghasilanZakat);
pengeluaranInput.addEventListener("input", updatePenghasilanZakat);
document
  .getElementById("zakatForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = e.target;
    // Ambil nilai numerik dari penghasilan dan zakat (hilangkan format rupiah)
    const penghasilanBersih = Number(
      (form.penghasilan_bersih.value || "0").replace(/[^\d]/g, "")
    );
    const zakat25 = Number((form.zakat_25.value || "0").replace(/[^\d]/g, ""));
    const data = {
      bulan: form.bulan.value,
      pemasukan: Number(form.pemasukan.value),
      pengeluaran: Number(form.pengeluaran.value),
      penghasilan_bersih: penghasilanBersih,
      keterangan_nishab: form.keterangan_nishab.value,
      zakat_25: zakat25,
    };
    const token = localStorage.getItem("token");
    const msgDiv = document.getElementById("msg");
    if (!token) {
      msgDiv.textContent = "Anda belum login!";
      msgDiv.style.color = "red";
      return;
    }
    msgDiv.textContent = "Mengirim...";
    try {
      const res = await fetch("http://localhost:4000/zakat-hitung", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      msgDiv.textContent = result.message || (res.ok ? "Berhasil!" : "Gagal!");
      msgDiv.style.color = res.ok ? "green" : "red";
    } catch (err) {
      msgDiv.textContent = "Gagal mengirim data!";
      msgDiv.style.color = "red";
    }
  });
