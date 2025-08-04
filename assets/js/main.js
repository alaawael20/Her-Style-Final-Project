document.addEventListener("DOMContentLoaded", function () {
  const cartIcons = document.querySelectorAll(".cartLogo");
  const cartSidebar = document.getElementById("cartSidebar");
  const closeCartBtn = document.getElementById("closeCart");
  const overlay = document.getElementById("overlay");
  const cartItemsContainer = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const applyDiscountBtn = document.getElementById("applyDiscount");
  const discountInput = document.getElementById("discountCode");
  const clearCartBtn = document.getElementById("clearCart");
  const confirmModal = document.getElementById("confirmModal");
  const confirmClearBtn = document.getElementById("confirmClear");
  const cancelClearBtn = document.getElementById("cancelClear");
  const openLoginModal = document.getElementById("openLoginModal");
  const loginModal = document.getElementById("loginModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const backToTopBtn = document.getElementById("backToTopBtn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let discountPercent = parseInt(localStorage.getItem("discount")) || 0;

  // ✅ زر إغلاق الشريط العلوي الأحمر
  const topBar = document.querySelector(".top-bar");
  const closeTopBarBtn = document.querySelector(".close-topbar");

  if (topBar && closeTopBarBtn) {
    closeTopBarBtn.addEventListener("click", () => {
      topBar.style.transition = "all 0.3s ease";
      topBar.style.opacity = "0";
      topBar.style.transform = "translateY(-100%)";
      setTimeout(() => {
        topBar.style.display = "none";
      }, 300);
    });
  }

  const toast = document.getElementById("toast");

  function showToast(message = "تمت الإضافة للسلة ✅") {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function openCart() {
    cartSidebar.classList.add("open");
    overlay.classList.add("active");
  }

  function closeCart() {
    cartSidebar.classList.remove("open");
    overlay.classList.remove("active");
  }

  cartIcons.forEach((icon) => icon.addEventListener("click", openCart));
  closeCartBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateTotalPrice() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discountedTotal = total - (total * discountPercent) / 100;
    totalPriceElement.textContent = discountedTotal.toFixed(2) + " ر.س";
  }

  function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart = [];
    discountPercent = 0;
    discountInput.value = "";
    localStorage.removeItem("discount");
    saveCart();
    renderCart();
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p class='text-center'>السلة فارغة</p>";
      updateTotalPrice();
      return;
    }

    cart.forEach((item, index) => {
      const itemHTML = document.createElement("div");
      itemHTML.className =
        "cart-item d-flex justify-content-between align-items-center mb-2";

      itemHTML.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${item.image}" alt="${item.title}" width="50">
          <div>
            <p class="m-0 fw-bold">${item.title}</p>
            <small class="item-price" data-price="${item.price}">
              ${item.price.toFixed(2)} ر.س × ${item.qty}
            </small>
          </div>
        </div>
        <button class="remove-btn" title="إزالة العنصر">&times;</button>
      `;

      itemHTML.querySelector(".remove-btn").addEventListener("click", () => {
        removeItem(index);
      });

      cartItemsContainer.appendChild(itemHTML);
    });

    updateTotalPrice();
  }

  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card");
      const title = productCard.querySelector(".product-title").textContent;
      const priceText = productCard.querySelector(".current-price").textContent;
      const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
      const image = productCard.querySelector(".product-img").src;

      const existingIndex = cart.findIndex((item) => item.title === title);

      if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.unshift({ title, price, image, qty: 1 });
      }

      saveCart();
      renderCart();
      showToast();
    });
  });

  applyDiscountBtn.addEventListener("click", () => {
    const code = discountInput.value.trim().toUpperCase();

    if (code === "SAVE10") {
      discountPercent = 10;
      localStorage.setItem("discount", discountPercent);
      showToast("✔ تم تطبيق خصم 10%");
    } else if (code === "SAVE20") {
      discountPercent = 20;
      localStorage.setItem("discount", discountPercent);
      showToast("✔ تم تطبيق خصم 20%");
    } else {
      discountPercent = 0;
      localStorage.removeItem("discount");
      showToast("❌ كود غير صالح");
    }

    updateTotalPrice();
  });

  clearCartBtn.addEventListener("click", () => {
    confirmModal.classList.add("active");
  });

  confirmClearBtn.addEventListener("click", () => {
    clearCart();
    confirmModal.classList.remove("active");
    showToast("✔ تم تفريغ السلة");
  });

  cancelClearBtn.addEventListener("click", () => {
    confirmModal.classList.remove("active");
  });

  renderCart();
});

openLoginModal.addEventListener("click", () => {
  loginModal.classList.add("active");
});

closeLoginModal.addEventListener("click", () => {
  loginModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove("active");
  }
});

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");

togglePassword.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  togglePassword.innerHTML =
    type === "password"
      ? `<i class="fas fa-eye"></i>`
      : `<i class="fas fa-eye-slash"></i>`;
});

window.onscroll = function () {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
};

backToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
