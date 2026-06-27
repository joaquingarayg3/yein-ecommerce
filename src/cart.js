let carrito = [];

const $sidebar = document.getElementById("cart-sidebar");
const $overlay = document.getElementById("cart-overlay");
const $cartList = document.getElementById("cart-items-list");
const $cartTotal = document.getElementById("cart-total");
const $cartCount = document.getElementById("cart-count-label");
const $countPage = document.getElementById("cart-count-page");
const $checkoutBtn = document.querySelector(".cart-checkout-btn");

export function agregarAlCarrito(producto) {
  const existente = carrito.find((p) => p.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  renderCarrito();
  guardarCarrito();
}

function quitarDelCarrito(id) {
  carrito = carrito.filter((p) => p.id !== id);
  renderCarrito();
  guardarCarrito();
}

function cambiarCantidad(id, delta) {
  const item = carrito.find((p) => p.id === id);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) quitarDelCarrito(id);
  else renderCarrito();
  guardarCarrito();
}

function renderCarrito() {
  if (!$cartCount || !$cartTotal || !$cartList) return;

  let totalItems = 0;
  carrito.forEach((p) => {
    totalItems = totalItems + p.cantidad;
  });

  $cartCount.textContent =
    totalItems + " producto" + (totalItems !== 1 ? "s" : "");

  if ($countPage) {
    $countPage.textContent = totalItems === 0 ? "" : totalItems;
  }

  let total = 0;
  carrito.forEach((p) => {
    total = total + p.price * p.cantidad;
  });
  $cartTotal.textContent = "$" + total.toFixed(2);

  if ($checkoutBtn) {
    if (carrito.length === 0) {
      $checkoutBtn.disabled = true;
      $checkoutBtn.style.opacity = "0.4";
      $checkoutBtn.style.cursor = "not-allowed";
    } else {
      $checkoutBtn.disabled = false;
      $checkoutBtn.style.opacity = "1";
      $checkoutBtn.style.cursor = "pointer";
    }
  }

  if (carrito.length === 0) {
    $cartList.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;height:100%;gap:12px;color:#bbb;padding:40px;">
        <p style="font-size:13px;letter-spacing:0.05em;">Tu carrito está vacío</p>
      </div>`;
    return;
  }

  $cartList.innerHTML = carrito
    .map(
      (item) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.image}" alt="${item.title}" />
      <div class="cart-item-info">
        <div class="cart-item-brand">${item.category}</div>
        <div class="cart-item-name">${item.title}</div>
        <div class="cart-item-qty-control">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span class="qty-num">${item.cantidad}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">$${(item.price * item.cantidad).toFixed(2)}</span>
        <button class="cart-item-remove" data-id="${item.id}">Quitar</button>
      </div>
    </div>
  `,
    )
    .join("");

  $cartList.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      cambiarCantidad(Number(btn.dataset.id), Number(btn.dataset.delta));
    });
  });

  $cartList.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      quitarDelCarrito(Number(btn.dataset.id));
    });
  });
}

export function abrirCarrito() {
  if (!$sidebar || !$overlay) return;
  $sidebar.style.display = "flex";
  $overlay.style.display = "block";
}

export function cerrarCarrito() {
  if (!$sidebar || !$overlay) return;
  $sidebar.style.display = "none";
  $overlay.style.display = "none";
}

function guardarCarrito() {
  localStorage.setItem("yein-carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem("yein-carrito");
  if (!guardado) return;
  carrito = JSON.parse(guardado);
  renderCarrito();
}

export function initCarrito() {
  cargarCarrito();

  const $shopCart = document.querySelector(".shopCart");
  const $closeCart = document.getElementById("cart-close-btn");
  const $overlayEl = document.getElementById("cart-overlay");
  const $continueBtn = document.getElementById("cart-continue-btn");
  const $checkoutBtn = document.querySelector(".cart-checkout-btn");

  if ($shopCart) {
    $shopCart.addEventListener("click", (e) => {
      e.preventDefault();
      abrirCarrito();
    });
  }
  if ($closeCart) {
    $closeCart.addEventListener("click", cerrarCarrito);
  }
  if ($overlayEl) {
    $overlayEl.addEventListener("click", cerrarCarrito);
  }
  if ($continueBtn) {
    $continueBtn.addEventListener("click", cerrarCarrito);
  }
  if ($checkoutBtn) {
    $checkoutBtn.addEventListener("click", () => {
      window.location.href = "/src/pages/checkout/";
    });
  }
}
