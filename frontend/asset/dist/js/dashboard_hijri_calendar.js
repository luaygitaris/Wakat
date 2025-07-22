document.addEventListener("DOMContentLoaded", function () {
  const hijriMonthNames = [
    "Muharram",
    "Safar",
    "Rabiul Awal",
    "Rabiul Akhir",
    "Jumadil Awal",
    "Jumadil Akhir",
    "Rajab",
    "Sya'ban",
    "Ramadhan",
    "Syawal",
    "Zulkaidah",
    "Dzulhijjah",
  ];
  const importantDays = [
    { day: 1, month: 1, label: "1 Muharram (Tahun Baru Hijriah)" },
    { day: 10, month: 1, label: "10 Muharram (Asyura)" },
    { day: 12, month: 3, label: "12 Rabiul Awal (Maulid Nabi)" },
    { day: 27, month: 7, label: "27 Rajab (Isra' Mi'raj)" },
    { day: 1, month: 9, label: "1 Ramadhan (Awal Puasa)" },
    { day: 17, month: 9, label: "17 Ramadhan (Nuzulul Qur'an)" },
    { day: 1, month: 10, label: "1 Syawal (Idul Fitri)" },
    { day: 10, month: 12, label: "10 Dzulhijjah (Idul Adha)" },
  ];

  let currentHijriDate = new Date();

  // Tambahkan parameter offset pada getHijriParts
  function getHijriParts(date, offset = 0) {
    const d = new Date(date);
    d.setDate(d.getDate() + offset);
    const fmt = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = fmt.formatToParts(d);
    return {
      day: parseInt(parts.find((p) => p.type === "day").value),
      month: parseInt(parts.find((p) => p.type === "month").value),
      year: parseInt(parts.find((p) => p.type === "year").value),
    };
  }

  function renderHijriCalendar(date) {
    const fmt = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = fmt.formatToParts(date);
    const hijriMonth = parseInt(parts.find((p) => p.type === "month").value);
    const hijriYear = parseInt(parts.find((p) => p.type === "year").value);
    const hijriMonthTitle = document.getElementById("hijriMonthTitle");
    hijriMonthTitle.innerText = `${
      hijriMonthNames[hijriMonth - 1]
    } ${hijriYear} H`;
    hijriMonthTitle.classList.add("text-h6", "font-bold", "mt-2", "md:mt-1");
    const daysContainer = document.getElementById("hijriCalendar");
    daysContainer.innerHTML = "";
    // Header hari
    ["Mg", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"].forEach((day) => {
      const div = document.createElement("div");
      div.className = "font-medium";
      div.innerText = day;
      daysContainer.appendChild(div);
    });
    // Hitung jumlah hari dalam bulan hijriah
    let daysInMonth = 30;
    for (let i = 31; i <= 30; i++) {
      const testDate = new Date(date);
      testDate.setDate(1);
      testDate.setDate(testDate.getDate() + i - 1);
      const partsTest = fmt.formatToParts(testDate);
      const testMonth = parseInt(
        partsTest.find((p) => p.type === "month").value
      );
      if (testMonth !== hijriMonth) {
        daysInMonth = i - 1;
        break;
      }
    }
    // Cari hari apa tanggal 1 Hijriah jatuh (0 = Minggu)
    const firstHijriDate = new Date(date);
    firstHijriDate.setDate(1);
    let gregorianDateForFirstHijri = null;
    // Cari tanggal 1 yang terdekat ke depan dari tanggal 1 di bulan ini
    for (let offset = 0; offset <= 30; offset++) {
      const temp = new Date(firstHijriDate);
      temp.setDate(temp.getDate() + offset);
      const parts = fmt.formatToParts(temp);
      const day = parseInt(parts.find((p) => p.type === "day").value);
      const month = parseInt(parts.find((p) => p.type === "month").value);
      if (day === 1 && month === hijriMonth) {
        gregorianDateForFirstHijri = temp;
        break;
      }
    }
    // Jika tidak ketemu, fallback ke firstHijriDate
    if (!gregorianDateForFirstHijri)
      gregorianDateForFirstHijri = firstHijriDate;
    const startDay = gregorianDateForFirstHijri.getDay();
    for (let i = 0; i < startDay; i++) {
      const empty = document.createElement("div");
      daysContainer.appendChild(empty);
    }
    // Render hari-hari bulan ini
    const agendaList = getAgendaList();
    for (let i = 1; i <= daysInMonth; i++) {
      const div = document.createElement("div");
      div.className = "py-1 rounded relative cursor-pointer hover:bg-primary";
      div.setAttribute("data-hijri", i);
      div.innerText = i;
      // Hari penting?
      const isImportant = importantDays.some(
        (d) => d.day === i && d.month === hijriMonth
      );
      // Ada agenda?
      const isAgenda = agendaList.some(
        (a) => a.day === i && a.month === hijriMonth
      );
      // Tandai hari ini
      const today = new Date();
      // Coba offset 0 (tanpa pengurangan hari)
      const todayParts = getHijriParts(today, 0); // offset 0 hari
      const isToday =
        todayParts.day === i &&
        todayParts.month === hijriMonth &&
        todayParts.year === hijriYear;
      // Warna prioritas: hari ini (hijau) > agenda (abu) > hari penting (merah) > hari biasa
      if (isToday) {
        div.classList.add("bg-success", "text-white", "font-bold");
      } else if (isAgenda) {
        div.classList.add("bg-biru", "text-black", "font-bold");
      } else if (isImportant) {
        div.classList.add("bg-red", "text-white", "font-bold");
      }
      // Tambahkan ring jika hari ini
      if (isToday) {
        div.classList.add("ring-2", "ring-success");
      }
      daysContainer.appendChild(div);
    }
    // Render keterangan hari penting & agenda sesuai bulan
    renderImportantDays(hijriMonth);
    renderAgendaList(hijriMonth);
    // Pastikan event delegation aktif setelah render
    setupCalendarClickHandler();
  }
  // Handler untuk dropdown notification
  const notifDropdown = document.querySelector(".dropdown-toggle.notification");
  notifDropdown?.addEventListener("click", function () {
    // Ambil bulan hijriah sekarang
    const now = new Date();
    const hijri = getHijriParts(now, 0); // offset 0 hari
    // Hari penting bulan ini
    const important = importantDays.filter((d) => d.month === hijri.month);
    // Agenda bulan ini
    const agenda = getAgendaList().filter((a) => a.month === hijri.month);
    // Build HTML
    let html = "";
    html += `<div class='font-bold text-base mb-2'>Hari Penting Bulan ${
      hijriMonthNames[hijri.month - 1]
    }</div>`;
    if (important.length === 0) {
      html +=
        '<div class="text-gray-400 mb-2">Tidak ada hari penting bulan ini.</div>';
    } else {
      html += '<ul class="mb-2">';
      important.forEach((d) => {
        html += `<li><span class='font-semibold'>${d.day}</span> - ${d.label}</li>`;
      });
      html += "</ul>";
    }
    html += `<div class='font-bold text-base mb-2'>Agenda Anda Bulan Ini</div>`;
    if (agenda.length === 0) {
      html += '<div class="text-gray-400">Belum ada agenda bulan ini.</div>';
    } else {
      html += "<ul>";
      agenda.forEach((a) => {
        html += `<li><span class='font-semibold'>${a.day}</span> - ${a.title}</li>`;
      });
      html += "</ul>";
    }
    // Masukkan ke dalam notification-content__box
    const notifBox = document.querySelector(".notification-content__box");
    if (notifBox) notifBox.innerHTML = html;
  });

  function renderImportantDays(bulanAktif) {
    const ul = document.getElementById("importantHijriDays");
    ul.innerHTML = "";
    importantDays
      .filter((d) => d.month === bulanAktif)
      .forEach((d) => {
        const li = document.createElement("li");
        li.innerText = d.label;
        ul.appendChild(li);
      });
    if (ul.innerHTML === "") {
      ul.innerHTML =
        '<li class="text-gray-400">Tidak ada hari penting bulan ini.</li>';
    }
  }

  function renderAgendaList(bulanAktif) {
    const ul = document.getElementById("agendaList");
    ul.innerHTML = "";
    const agendaList = getAgendaList().filter((a) => a.month === bulanAktif);
    if (agendaList.length === 0) {
      ul.innerHTML =
        '<li class="text-gray-400">Belum ada agenda bulan ini.</li>';
      return;
    }
    agendaList.forEach((a, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="text-gray-400">${a.day} ${
        hijriMonthNames[a.month - 1]
      }</span> (${a.title})
        <button class="ml-2 text-xs text-blue-600 underline btn-edit-agenda" data-idx="${idx}" title="Edit">Edit</button>
        <button class="ml-1 text-xs text-red-600 underline btn-hapus-agenda" data-idx="${idx}" title="Hapus">Hapus</button>`;
      ul.appendChild(li);
    });
    // Event handler hapus & edit
    setTimeout(() => {
      const btnsHapus = document.querySelectorAll(".btn-hapus-agenda");
      btnsHapus.forEach((btn) => {
        btn.onclick = function () {
          const idx = parseInt(btn.getAttribute("data-idx"));
          let agendaList = getAgendaList();
          // Hapus hanya agenda pada bulan ini
          const filtered = agendaList.filter((a) => a.month === bulanAktif);
          const globalIdx = agendaList.findIndex(
            (a, i) => a.month === bulanAktif && i === idx
          );
          if (globalIdx !== -1) {
            if (confirm("Yakin ingin menghapus agenda ini?")) {
              agendaList.splice(globalIdx, 1);
              saveAgendaList(agendaList);
              renderAgendaList(bulanAktif);
              renderHijriCalendar(currentHijriDate);
            }
          }
        };
      });
      const btnsEdit = document.querySelectorAll(".btn-edit-agenda");
      btnsEdit.forEach((btn) => {
        btn.onclick = function () {
          const idx = parseInt(btn.getAttribute("data-idx"));
          let agendaList = getAgendaList();
          const filtered = agendaList.filter((a) => a.month === bulanAktif);
          const agenda = filtered[idx];
          if (agenda) {
            document.getElementById("agendaPopup").classList.remove("hidden");
            document.getElementById("agendaHijriDay").value = agenda.day;
            document.getElementById("agendaHijriMonth").value = agenda.month;
            document.getElementById("agendaHijriDateText").innerText = `${
              agenda.day
            } ${hijriMonthNames[agenda.month - 1]}`;
            document.getElementById("agendaTitle").value = agenda.title;
            // Simpan index edit di dataset
            document
              .getElementById("agendaForm")
              .setAttribute("data-edit-idx", idx);
          }
        };
      });
    }, 0);
  }

  function getUserId() {
    // Ambil userId dari localStorage user object (misal: user.id)
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) return user.id;
        // fallback jika id tidak ada, coba user.user_id atau user.userId
        if (user && user.user_id) return user.user_id;
        if (user && user.ID) return user.ID;
      }
    } catch {}
    return "default";
  }
  function getAgendaList() {
    try {
      const userId = getUserId();
      return JSON.parse(
        localStorage.getItem("hijriAgendaList_" + userId) || "[]"
      );
    } catch {
      return [];
    }
  }
  function saveAgendaList(list) {
    const userId = getUserId();
    localStorage.setItem("hijriAgendaList_" + userId, JSON.stringify(list));
  }
  function openAgendaPopup(day, month, year) {
    document.getElementById("agendaPopup").classList.remove("hidden");
    document.getElementById("agendaHijriDay").value = day;
    document.getElementById("agendaHijriMonth").value = month;
    document.getElementById("agendaHijriDateText").innerText = `${day} ${
      hijriMonthNames[month - 1]
    } ${year} H`;
    document.getElementById("agendaTitle").value = "";
  }
  document.getElementById("closeAgendaPopup").onclick = function () {
    document.getElementById("agendaPopup").classList.add("hidden");
  };
  document.getElementById("agendaForm").onsubmit = function (e) {
    e.preventDefault();
    const day = parseInt(document.getElementById("agendaHijriDay").value);
    const month = parseInt(document.getElementById("agendaHijriMonth").value);
    const title = document.getElementById("agendaTitle").value.trim();
    if (!title) return;
    let agendaList = getAgendaList();
    const editIdx = this.getAttribute("data-edit-idx");
    const userId = getUserId();
    if (editIdx !== null && editIdx !== undefined) {
      // Edit mode
      let filtered = agendaList.filter((a) => a.month === month);
      const globalIdx = agendaList.findIndex(
        (a, i) => a.month === month && i === parseInt(editIdx)
      );
      if (globalIdx !== -1) {
        // Pastikan userId tetap sama pada edit
        agendaList[globalIdx] = {
          day,
          month,
          title,
          userId: agendaList[globalIdx].userId || userId,
        };
      }
      this.removeAttribute("data-edit-idx");
    } else {
      // Tambah baru, selalu simpan userId
      agendaList.push({ day, month, title, userId });
    }
    saveAgendaList(agendaList);
    document.getElementById("agendaPopup").classList.add("hidden");
    renderAgendaList(month);
    renderHijriCalendar(currentHijriDate);
  };
  // Navigasi bulan
  if (document.getElementById("prevHijriMonth")) {
    document.getElementById("prevHijriMonth").onclick = function () {
      currentHijriDate.setMonth(currentHijriDate.getMonth() - 1);
      renderHijriCalendar(currentHijriDate);
    };
  }
  if (document.getElementById("nextHijriMonth")) {
    document.getElementById("nextHijriMonth").onclick = function () {
      currentHijriDate.setMonth(currentHijriDate.getMonth() + 1);
      renderHijriCalendar(currentHijriDate);
    };
  }
  // Tampilkan agenda yang berulang setiap tahun
  function getAgendaForMonth(month) {
    const agendaList = getAgendaList();
    return agendaList.filter((a) => a.month === month);
  }
  // Tambahkan event delegation untuk klik tanggal pada kalender
  function setupCalendarClickHandler() {
    const hijriCalendar = document.getElementById("hijriCalendar");
    if (!hijriCalendar._agendaClickBound) {
      hijriCalendar.addEventListener("click", function (e) {
        const target = e.target.closest("[data-hijri]");
        if (target && target.getAttribute("data-hijri")) {
          const day = parseInt(target.getAttribute("data-hijri"));
          if (day > 0 && day <= 31) {
            const monthTitle =
              document.getElementById("hijriMonthTitle").innerText;
            let month = 1,
              year = 1446;
            for (let i = 0; i < hijriMonthNames.length; i++) {
              if (monthTitle.includes(hijriMonthNames[i])) {
                month = i + 1;
                break;
              }
            }
            const match = monthTitle.match(/(\d+)\s*H/);
            if (match) year = parseInt(match[1]);
            openAgendaPopup(day, month, year);
          }
        }
      });
      hijriCalendar._agendaClickBound = true;
    }
  }
  // Render awal
  if (document.getElementById("hijriCalendar")) {
    renderHijriCalendar(currentHijriDate);
    setupCalendarClickHandler();
  }
});
