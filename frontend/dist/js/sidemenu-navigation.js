document.addEventListener("DOMContentLoaded", function () {
  function switchPage(parentId, subId) {
    document.querySelectorAll(".content").forEach((content) => {
      content.style.display = "none";
    });

    const pageToShow = document.getElementById(`${parentId}-${subId}-aaa`);
    if (pageToShow) {
      pageToShow.style.display = "block";
    }
  }

  function handleMenuClick(menuItem, parentId, subId) {
    // Hapus semua active class
    document.querySelectorAll(".side-menu").forEach((menu) => {
      menu.classList.remove("side-menu--active");
    });

    // Tambahkan active class pada menu yang diklik
    menuItem.classList.add("side-menu--active");

    // Tentukan URL baru
    const newUrl = subId === "dashboard" ? "/" : `/${parentId}/${subId}`;
    history.pushState(null, "", newUrl);

    // Tampilkan halaman sesuai ID
    switchPage(parentId, subId);
  }

  function setupMenuListeners() {
    const subMenus = document.querySelectorAll("li[data-page] > a");

    subMenus.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const subLi = this.closest("li[data-page]");
        const subId = subLi.getAttribute("data-page");

        let parentLi = subLi.closest("ul").closest("li");
        let parentId = "dashboard"; // default fallback

        if (parentLi && parentLi.querySelector("a")) {
          const parentLink = parentLi.querySelector("a");
          const idParts = parentLink.id ? parentLink.id.split("-") : [];
          if (idParts.length > 0) {
            parentId = idParts[0];
          }
        }

        handleMenuClick(this, parentId, subId);
      });
    });

    // Jika buka halaman langsung dengan path tertentu
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length === 2) {
      switchPage(pathParts[0], pathParts[1]);
    } else {
      // Default ke dashboard-dashboard
      switchPage("dashboard", "dashboard");
    }
  }

  setupMenuListeners();
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleMenu = (menuLink) => {
    const parentLi = menuLink.closest("li");
    const submenu = parentLi.querySelector("ul");
    const icon = menuLink.querySelector(".side-menu__sub-icon");

    if (submenu) {
      submenu.classList.toggle("side-menu__sub-open");
    }

    if (icon) {
      icon.classList.toggle("rotate-180");
    }
  };

  // Ambil semua menu yang punya submenu
  const menuLinks = document.querySelectorAll(".side-nav > ul > li > a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      toggleMenu(this);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const mobileMenu = document.querySelector(".mobile-menu");
  const openToggler = document.querySelector(
    ".mobile-menu-bar .mobile-menu-toggler"
  );
  const closeToggler = document.querySelector(
    ".scrollable .mobile-menu-toggler"
  );

  if (openToggler && mobileMenu) {
    openToggler.addEventListener("click", function (e) {
      e.preventDefault();
      mobileMenu.classList.add("mobile-menu--active");
    });
  }

  if (closeToggler && mobileMenu) {
    closeToggler.addEventListener("click", function (e) {
      e.preventDefault();
      mobileMenu.classList.remove("mobile-menu--active");
    });
  }

  const menuLinks = mobileMenu.querySelectorAll("a");

  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const parentLi = this.closest("li");
      const submenu = parentLi?.querySelector("ul");

      // Jika menu utama (punya submenu), hanya toggle dropdown, jangan tutup mobile menu
      if (submenu) {
        e.preventDefault();
        submenu.classList.toggle("menu__sub-open");
        const icon = this.querySelector(".menu__sub-icon");
        if (icon) icon.classList.toggle("rotate-180");
        return;
      }

      // Jika submenu (tidak punya submenu lagi), lakukan navigasi dan tutup mobile menu
      e.preventDefault();
      let parentId = "";
      let subId = "";
      const subTitle =
        this.querySelector(".menu__title")?.textContent.trim().toLowerCase() ||
        "";
      if (
        [
          "home",
          "dashboard",
          "waris",
          "dalil",
          "hitung",
          "riwayat",
          "zakat",
        ].includes(subTitle)
      ) {
        subId = subTitle === "home" ? "dashboard" : subTitle;
      }
      const parentTitle =
        this.closest("ul")
          ?.closest("li")
          ?.querySelector("a .menu__title")
          ?.textContent.trim()
          .toLowerCase() || "";
      if (parentTitle.includes("dashboard")) parentId = "dashboard";
      else if (parentTitle.includes("waris")) parentId = "waris";
      else if (parentTitle.includes("zakat")) parentId = "zakat";
      if (!parentId) parentId = subId;
      if (parentId && subId) {
        document.querySelectorAll(".content").forEach((content) => {
          content.style.display = "none";
        });
        const pageToShow = document.getElementById(`${parentId}-${subId}-aaa`);
        if (pageToShow) {
          pageToShow.style.display = "block";
        }
        const newUrl = subId === "dashboard" ? "/" : `/${parentId}/${subId}`;
        history.pushState(null, "", newUrl);
        mobileMenu.classList.remove("mobile-menu--active"); // Tutup hanya jika submenu
      }
    });
  });
});

// Login Form Toggle

// Login Form Handling
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");

  const loginFormToggle = document.getElementById("loginFormToggle");
  const loginForm = document.getElementById("loginForm");
  const profileToggle = document.getElementById("profileToggle");
  const profileMenu = document.getElementById("profileMenu");

  // Perbaiki event toggle login form agar tidak error jika elemen tidak ada
  if (loginFormToggle && loginForm) {
    loginFormToggle.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm.classList.toggle("hidden");
    });
  }

  const showSignup = document.getElementById("showSignup");
  showSignup.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    document.getElementById("signupForm").classList.remove("hidden");
  });

  // Perbaiki event handler loginButton agar tidak error jika elemen tidak ada
  if (loginButton && emailInput && passwordInput && message) {
    loginButton.addEventListener("click", async function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      message.classList.add("hidden");
      message.textContent = "";

      if (!email || !password) {
        message.textContent = "Email dan password wajib diisi.";
        message.classList.remove("hidden");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("Login response:", data); // Untuk debugging

        if (
          res.status !== 200 ||
          data.status !== "success" ||
          !data.data?.token
        ) {
          message.textContent = data.message || "Login gagal.";
          message.classList.remove("hidden");
          return;
        }

        // Login berhasil
        const { token, user } = data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        updateUIAfterLogin(user);
      } catch (error) {
        console.error("Login error:", error);
        message.textContent = "Terjadi kesalahan saat login. Silakan coba lagi.";
        message.classList.remove("hidden");
      }
    });
  }

  function updateUIAfterLogin(user) {
    // Perbarui tampilan profil
    const usernameEl = document.getElementById("username");
    if (usernameEl) usernameEl.textContent = user.display_name;

    const userLoginEl = document.querySelector("#profileMenu .text-xs");
    if (userLoginEl) userLoginEl.textContent = user.user_login;

    document.getElementById("loginForm")?.classList.add("hidden");
    document.getElementById("loginFormToggle")?.classList.add("hidden");
    document.getElementById("profileToggle")?.classList.remove("hidden");
    document.getElementById("profileMenu")?.classList.add("hidden"); // pastikan tetap hidden setelah login

    // Tampilkan menu tambahan jika sudah login
    document.getElementById("side-menu-waris")?.classList.remove("hidden");
    document.getElementById("side-menu-zakat")?.classList.remove("hidden");
    document.getElementById("mobile-menu-waris")?.classList.remove("hidden");
    document.getElementById("mobile-menu-zakat")?.classList.remove("hidden");
  }

  // Auto-login saat reload jika token masih ada
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      updateUIAfterLogin(user);
    } catch (err) {
      console.error("Error parsing stored user:", err);
    }
  }

  // Logout
  document.getElementById("logoutButton")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    location.reload();
  });

  document
    .getElementById("signupButton")
    .addEventListener("click", async () => {
      const username = document.getElementById("signupUsername").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();
      const messageBox = document.getElementById("signupMessage");

      messageBox.classList.add("hidden");
      messageBox.textContent = "";

      if (!email || !password) {
        messageBox.textContent = "Email and password are required.";
        messageBox.classList.remove("hidden");
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            display_name: username,
          }),
        });

        const result = await response.json();

        if (!response.ok || result.err) {
          messageBox.textContent =
            result?.flow?.slice(-1)[0] || "Registration failed.";
          messageBox.classList.remove("hidden");
          return;
        }

        // Sukses
        alert("Registration successful!");
        // Simpan token jika perlu
        localStorage.setItem("token", result.data.token);
        // Redirect atau tutup form
        window.location.reload(); // atau arahkan ke dashboard
      } catch (error) {
        messageBox.textContent = "An error occurred during registration.";
        messageBox.classList.remove("hidden");
        console.error(error);
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Toggle dashboard submenu when icon-dashboard is clicked
  const dashboardIcon = document.querySelector('.icon-dashboard');
  if (dashboardIcon) {
    dashboardIcon.addEventListener('click', function(e) {
      e.preventDefault();
      // Cari parent <li> dari icon-dashboard
      const parentLi = dashboardIcon.closest('li') || dashboardIcon.closest('.side-menu').parentElement;
      // Cari submenu dashboard
      // Cari UL setelah .side-menu (bukan .side-menu__sub-open saja)
      let submenu = null;
      if (parentLi) {
        submenu = parentLi.querySelector('ul');
      } else {
        // fallback: cari ul setelah .side-menu__title
        const titleDiv = dashboardIcon.closest('.side-menu__title');
        submenu = titleDiv?.parentElement?.querySelector('ul');
      }
      if (submenu) {
        submenu.classList.toggle('side-menu__sub-open');
        // Toggle icon rotate
        dashboardIcon.classList.toggle('rotate-180');
      }
    });
  }
});

// Cegah autofill pada input search
// dan pastikan id & name unik
// (tambahkan di paling atas agar DOM sudah siap)
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector('.search__input');
  if (searchInput) {
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('id', 'searchInput');
    searchInput.removeAttribute('name');
  }
});

// Toggle profile menu saat profileToggle diklik
// (agar setelah login, klik profileToggle langsung munculkan menu)
document.addEventListener("DOMContentLoaded", function () {
  const profileToggle = document.getElementById("profileToggle");
  const profileMenu = document.getElementById("profileMenu");
  if (profileToggle && profileMenu) {
    profileToggle.addEventListener("click", function (e) {
      e.preventDefault();
      profileMenu.classList.toggle("hidden");
    });
  }
});
