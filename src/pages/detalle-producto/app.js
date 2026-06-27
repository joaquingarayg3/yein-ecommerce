import { getOneProductById } from "@/services/api";
import {
  agregarAlCarrito,
  initCarrito,
  abrirCarrito,
  cerrarCarrito,
} from "/src/cart";

const $main = document.querySelector(".detail-main");
const $shopCart = document.querySelector(".shopCart");
const $overlay = document.getElementById("cart-overlay");
const $closeCart = document.getElementById("cart-close-btn");
const $continue = document.getElementById("cart-continue-btn");

const url = new URL(window.location.href);
const id = url.searchParams.get("id");

initCarrito();

function showProductInfo(product) {
  if (!product) {
    $main.innerHTML = `
      <p style="text-align:center; color:#999; padding:60px;">
        No se encontró el producto. <a href="/">Volver a la tienda</a>
      </p>`;
    return;
  }

  const { title, price, category, image, description } = product;
  $main.innerHTML = `
    <a class="back-link" href="/">← Volver</a>
    <div class="detail-layout">
      <div class="detail-image-col">
        <img class="detail-img" src="${image}" alt="${title}" />
      </div>
      <div class="detail-info-col">
        <span class="detail-category">${category}</span>
        <h1 class="detail-name">${title}</h1>
        <p class="detail-price">$${price}</p>
        <p class="detail-description">${description}</p>
        <button class="detail-add-btn" id="detail-add-btn">AÑADIR AL CARRITO</button>
      </div>
    </div>`;

  const $btnBuy = document.getElementById("detail-add-btn");
  if ($btnBuy) {
    $btnBuy.addEventListener("click", () => {
      agregarAlCarrito({ ...product, id: Number(product.id) });
    });
  }
}

if (!id) {
  window.location.href = "/";
} else {
  getOneProductById(id)
    .then(showProductInfo)
    .catch(() => {
      if ($main) {
        $main.innerHTML = `
          <p style="text-align:center; color:#999; padding:60px;">
            Error al cargar el producto. <a href="/">Volver a la tienda</a>
          </p>`;
      }
    });
}

if ($shopCart) {
  $shopCart.addEventListener("click", (e) => {
    e.preventDefault();
    abrirCarrito();
  });
}
if ($closeCart) {
  $closeCart.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarCarrito();
  });
}
if ($overlay) {
  $overlay.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarCarrito();
  });
}
if ($continue) {
  $continue.addEventListener("click", (e) => {
    e.preventDefault();
    cerrarCarrito();
  });
}
