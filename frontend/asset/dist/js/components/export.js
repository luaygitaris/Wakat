async function exportAsImage() {
  const target = document.getElementById("export-target");
  const canvas = await html2canvas(target);
  const link = document.createElement("a");
  link.download = "exported-image.png";
  link.href = canvas.toDataURL();
  link.click();
}

async function exportAsPDF() {
  const target = document.getElementById("export-target");
  const canvas = await html2canvas(target);
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("exported-file.pdf");
}

function handleExport(select) {
  if (select.value === "image") {
    exportAsImage();
  } else if (select.value === "pdf") {
    exportAsPDF();
  }
  // Reset dropdown
  select.selectedIndex = 0;
}
