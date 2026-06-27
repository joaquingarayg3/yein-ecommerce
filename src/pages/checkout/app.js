let carrito = JSON.parse(localStorage.getItem("yein-carrito")) || [];

const $items = document.getElementById("summary-items");
const $total = document.getElementById("summary-total");
const $checkoutBtn = document.getElementById("checkout-btn");
const $successOverlay = document.getElementById("success-overlay");
const $successBtn = document.getElementById("success-btn");

function renderResumen() {
  if (!$items || !$total) return;

  $items.innerHTML = "";

  if (carrito.length === 0) {
    $items.innerHTML = `
      <p style="font-size:12px; color:#bbb; text-align:center; padding:20px;">
        No hay productos en el carrito
      </p>`;
    $total.textContent = "$0.00";
    return;
  }

  carrito.forEach((item) => {
    const $div = document.createElement("div");
    $div.classList.add("summary-item");
    $div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div>
        <div class="summary-item-name">${item.title}</div>
        <div class="summary-item-qty">x${item.cantidad}</div>
      </div>
      <span class="summary-item-price">$${(item.price * item.cantidad).toFixed(2)}</span>
    `;
    $items.appendChild($div);
  });

  let total = 0;
  carrito.forEach((item) => {
    total = total + item.price * item.cantidad;
  });
  $total.textContent = "$" + total.toFixed(2);
}

renderResumen();

function validarCampos() {
  const nombreEl = document.getElementById("nombre");
  const emailEl = document.getElementById("email");
  const direccionEl = document.getElementById("direccion");
  const ciudadEl = document.getElementById("ciudad");
  const titularEl = document.getElementById("titular");
  const numeroEl = document.getElementById("numero");
  const vencimientoEl = document.getElementById("vencimiento");
  const cvvEl = document.getElementById("cvv");

  if (
    !nombreEl ||
    !emailEl ||
    !direccionEl ||
    !ciudadEl ||
    !titularEl ||
    !numeroEl ||
    !vencimientoEl ||
    !cvvEl
  ) {
    alert("Error: faltan campos en el formulario");
    return false;
  }

  const nombre = nombreEl.value.trim();
  const email = emailEl.value.trim();
  const direccion = direccionEl.value.trim();
  const ciudad = ciudadEl.value.trim();
  const titular = titularEl.value.trim();
  const numero = numeroEl.value.trim();
  const vencimiento = vencimientoEl.value.trim();
  const cvv = cvvEl.value.trim();

  if (nombre === "") {
    alert("El nombre no puede estar vacío");
    return false;
  }
  if (nombre.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres");
    return false;
  }

  if (email === "") {
    alert("El email no puede estar vacío");
    return false;
  }
  if (!email.includes("@") || !email.includes(".")) {
    alert("Ingresá un email válido");
    return false;
  }

  if (direccion.length < 5) {
    alert("Ingresá una dirección válida");
    return false;
  }

  if (ciudad === "") {
    alert("La ciudad no puede estar vacía");
    return false;
  }

  if (titular === "") {
    alert("El titular no puede estar vacío");
    return false;
  }

  if (numero.length !== 16) {
    alert("El número de tarjeta debe tener 16 dígitos");
    return false;
  }
  if (isNaN(numero)) {
    alert("El número de tarjeta solo puede contener números");
    return false;
  }

  if (vencimiento.length !== 5 || vencimiento[2] !== "/") {
    alert("El vencimiento debe tener el formato MM/AA");
    return false;
  }

  if (cvv.length !== 3) {
    alert("El CVV debe tener 3 dígitos");
    return false;
  }
  if (isNaN(cvv)) {
    alert("El CVV solo puede contener números");
    return false;
  }

  return true;
}

if ($checkoutBtn) {
  $checkoutBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    const esValido = validarCampos();
    if (!esValido) return;

    localStorage.removeItem("yein-carrito");

    if ($successOverlay) {
      $successOverlay.classList.add("active");
    }
  });
}

if ($successBtn) {
  $successBtn.addEventListener("click", () => {
    window.location.href = "/";
  });
}
