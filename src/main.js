import { getAllProducts } from "@/services/api";
import {
  agregarAlCarrito,
  initCarrito,
  abrirCarrito,
  cerrarCarrito,
} from "/src/cart.js";

const $productContainer = document.getElementById("product-container");
const $overlay = document.getElementById("cart-overlay");
const $shopCart = document.querySelector(".shopCart");
const $closeCart = document.getElementById("cart-close-btn");
const $continue = document.getElementById("cart-continue-btn");
const $searchbar = document.getElementById("searchbar");
const $filtrosContainer = document.getElementById("filtros-container");
const $ordenSelect = document.getElementById("orden-select");

let todosLosProductos = [];
let categoriaActiva = "todas";

function renderFiltros(productos) {
  if (!$filtrosContainer) return;

  const categorias = ["todas", ...new Set(productos.map((p) => p.category))];

  $filtrosContainer.innerHTML = categorias
    .map(
      (cat) => `
    <button
      class="filtro-btn ${cat === categoriaActiva ? "filtro-activo" : ""}"
      data-categoria="${cat}"
    >
      ${cat === "todas" ? "Todas" : cat}
    </button>
  `,
    )
    .join("");

  $filtrosContainer.querySelectorAll(".filtro-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      categoriaActiva = btn.dataset.categoria;
      if ($searchbar) $searchbar.value = "";
      aplicarFiltros();
      renderFiltros(todosLosProductos);
    });
  });
}

function aplicarFiltros() {
  const termino = $searchbar ? $searchbar.value.trim().toLowerCase() : "";
  const orden = $ordenSelect ? $ordenSelect.value : "default";

  let filtrados = todosLosProductos.filter((p) => {
    const coincideNombre = p.title.toLowerCase().includes(termino);
    const coincideCategoria =
      categoriaActiva === "todas" || p.category === categoriaActiva;
    return coincideNombre && coincideCategoria;
  });

  if (orden === "az") {
    filtrados.sort((a, b) => a.title.localeCompare(b.title));
  } else if (orden === "za") {
    filtrados.sort((a, b) => b.title.localeCompare(a.title));
  } else if (orden === "precio-asc") {
    filtrados.sort((a, b) => a.price - b.price);
  } else if (orden === "precio-desc") {
    filtrados.sort((a, b) => b.price - a.price);
  }

  renderProductos(filtrados);
}

function createProduct({ id, title, price, category, image }) {
  const $card = document.createElement("div");
  $card.classList.add("product-card");

  const $redirection = document.createElement("a");
  $redirection.href = `/src/pages/detalle-producto/?id=${id}`;

  const $img = document.createElement("img");
  $img.src = image;
  $img.alt = title;
  $redirection.appendChild($img);

  const $content = document.createElement("div");
  $content.classList.add("card-content");

  const $category = document.createElement("span");
  $category.classList.add("category");
  $category.textContent = category;

  const $name = document.createElement("h3");
  $name.classList.add("name");
  $name.textContent = title;

  const $price = document.createElement("p");
  $price.classList.add("price");
  $price.textContent = "$" + price;

  const $btnBuy = document.createElement("button");
  $btnBuy.textContent = "AÑADIR";
  $btnBuy.addEventListener("click", (e) => {
    e.stopPropagation();
    agregarAlCarrito({ id, title, price, category, image });
  });

  $content.append($category, $name, $price, $btnBuy);
  $card.append($redirection, $content);
  $productContainer.appendChild($card);
}

function renderProductos(productos) {
  if (!$productContainer) return;
  $productContainer.innerHTML = "";
  if (productos.length === 0) {
    $productContainer.innerHTML = `
      <p style="
        grid-column: 1 / -1;
        text-align: center;
        color: #bbb;
        font-size: 13px;
        letter-spacing: 0.08em;
        padding: 60px 0;
      ">No se encontraron productos</p>
    `;
    return;
  }
  productos.forEach(createProduct);
}

getAllProducts()
  .then((productos) => {
    todosLosProductos = productos;
    renderProductos(todosLosProductos);
    renderFiltros(todosLosProductos);
  })
  .catch((error) => {
    console.error("Error al cargar productos:", error);
    if ($productContainer) {
      $productContainer.innerHTML = `
        <p style="text-align:center; color:#999; padding:60px; grid-column:1/-1;">
          No se pudieron cargar los productos. Intentá de nuevo más tarde.
        </p>
      `;
    }
  });

if ($searchbar) $searchbar.addEventListener("input", aplicarFiltros);
if ($ordenSelect) $ordenSelect.addEventListener("change", aplicarFiltros);

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

initCarrito();
