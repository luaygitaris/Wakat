const container = document.getElementById("drag-container");
let isDown = false;
let startX, startY, scrollLeft, scrollTop;

container.addEventListener("mousedown", (e) => {
  isDown = true;
  container.classList.add("cursor-grabbing");
  startX = e.pageX - container.offsetLeft;
  startY = e.pageY - container.offsetTop;
  scrollLeft = container.scrollLeft;
  scrollTop = container.scrollTop;
});

container.addEventListener("mouseleave", () => {
  isDown = false;
  container.classList.remove("cursor-grabbing");
});

container.addEventListener("mouseup", () => {
  isDown = false;
  container.classList.remove("cursor-grabbing");
});

container.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - container.offsetLeft;
  const y = e.pageY - container.offsetTop;
  const walkX = x - startX;
  const walkY = y - startY;
  container.scrollLeft = scrollLeft - walkX;
  container.scrollTop = scrollTop - walkY;
});

document.querySelectorAll(".person").forEach((person) => {
  const status = person.getAttribute("data-status");
  if (status === "meninggal") {
    person.classList.add("deceased");
  }
});

// Optional: klik handler untuk menampilkan info
const popup = document.getElementById("info-popup");
document.querySelectorAll(".person").forEach((person) => {
  person.addEventListener("click", (e) => {
    e.stopPropagation();

    const name = person.getAttribute("data-name");
    const status = person.getAttribute("data-status");

    popup.innerHTML = `
        <strong>Nama:</strong> ${name}<br>
        <strong>Status:</strong> ${
          status === "meninggal" ? "Meninggal" : "Hidup"
        }
      `;
    popup.style.display = "block";
  });
});

document.addEventListener("click", () => {
  popup.style.display = "none";
});
