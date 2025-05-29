function showContent(contentId) {
  const allContents = ["content1", "content2", "content3", "content4"];

  // Sembunyikan semua konten
  allContents.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  // Tampilkan konten yang dipilih
  const target = document.getElementById(contentId);
  if (target) target.classList.remove("hidden");

  // Update active class di tab
  document
    .querySelectorAll(".nav-link")
    .forEach((btn) => btn.classList.remove("active"));

  const activeBtn = Array.from(document.querySelectorAll(".nav-link")).find(
    (btn) => btn.getAttribute("onclick")?.includes(contentId)
  );

  if (activeBtn) activeBtn.classList.add("active");

  // Opsional: Update dropdown agar sinkron juga (saat user klik tab)
  const dropdown = document.querySelector("select");
  if (dropdown && dropdown.value !== contentId) {
    dropdown.value = contentId;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  showContent("content1"); // Set default tab saat pertama kali dimuat
});
