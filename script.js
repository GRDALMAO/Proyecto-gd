console.log("El archivo script.js está enlazado correctamente.");
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const nombreInput = document.getElementById("nombre");
  const celularInput = document.getElementById("celular");
  const emailInput = document.getElementById("email");

  form.addEventListener("submit", (event) => {
    let isValid = true;

    // Validación del Nombre: debe tener solo letras y al menos 2 caracteres
    const nombreValue = nombreInput.value.trim();
    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(nombreValue)) {
      isValid = false;
      alert(
        "Por favor, ingrese un nombre válido (solo letras y al menos 2 caracteres)."
      );
    }

    // Validación del Teléfono: debe seguir un formato numérico internacional
    const celularValue = celularInput.value.trim();
    if (!/^\+?[0-9\s\-]{7,15}$/.test(celularValue)) {
      isValid = false;
      alert(
        "Por favor, ingrese un número de teléfono válido (ejemplo: +54 9 1123456789)."
      );
    }

    // Validación del Email: debe seguir el formato estándar de correo
    const emailValue = emailInput.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      isValid = false;
      alert("Por favor, ingrese un correo electrónico válido.");
    }

    // Prevenir el envío si hay errores
    if (!isValid) {
      event.preventDefault();
    }
  });
});
fetch("productos.json")
  .then((response) => response.json())
  .then((data) => {
    const productosContainer = document.getElementById("productos-container");
    // Agregar productos cargados desde JSON
    data.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card");
      productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
        `;
      productosContainer.appendChild(productCard);
    });
  })
  .catch((error) => {
    console.error("Error al cargar los productos:", error);
  });
function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Comprobar si el producto ya está en el carrito
  const index = carrito.findIndex((item) => item.id === producto.id);
  if (index === -1) {
    carrito.push({ ...producto, cantidad: 1 }); // Si no está, añadirlo con cantidad 1
  } else {
    carrito[index].cantidad++; // Si ya está, incrementar la cantidad
  }

  // Guardar el carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizar el contador del carrito
  actualizarContadorCarrito();
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const totalProductos = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );
  document.getElementById("carrito-count").textContent = totalProductos;
}
// Función para abrir el modal del carrito
function abrirCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const productosCarrito = document.getElementById("productos-en-carrito");

  // Limpiar productos del carrito en el modal
  productosCarrito.innerHTML = "";

  if (carrito.length === 0) {
    productosCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
  } else {
    carrito.forEach((producto) => {
      const productoDiv = document.createElement("div");
      productoDiv.classList.add("producto-carrito");
      productoDiv.innerHTML = `
        <img src="${producto.image}" alt="${producto.title}">
        <h3>${producto.title}</h3>
        <p>Cantidad: ${producto.cantidad}</p>
      `;
      productosCarrito.appendChild(productoDiv);
    });
  }

  // Mostrar el modal
  document.getElementById("carritoModal").style.display = "block";
}

// Función para cerrar el modal del carrito
function cerrarCarrito() {
  document.getElementById("carritoModal").style.display = "none";
}

// Función para vaciar el carrito
function vaciarCarrito() {
  localStorage.removeItem("carrito");
  abrirCarrito(); // Recargar el modal después de vaciar el carrito
  actualizarContadorCarrito(); // Actualizar el contador del carrito
}

let productos = []; // Variable global para almacenar los productos

// Función para cargar los productos desde el archivo JSON
async function cargarProductos() {
  try {
    const response = await fetch("Productos.json"); // Ruta de tu archivo JSON
    productos = await response.json(); // Asignamos los productos a la variable global
    console.log("Productos cargados:", productos);

    const productosContainer = document.getElementById("productos-container");
    productosContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar productos

    productos.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("card");
      productCard.innerHTML = `
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <p>${product.description}</p>
              <button onclick="agregarAlCarrito(${product.id})">Agregar al Carrito</button>
            `;
      productosContainer.appendChild(productCard);
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

// Función para agregar un producto al carrito
function agregarAlCarrito(productId) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = productos.find((p) => p.id === productId);

  if (!carrito.some((p) => p.id === productId)) {
    carrito.push({ ...producto, cantidad: 1 });
  } else {
    carrito = carrito.map((p) =>
      p.id === productId ? { ...p, cantidad: p.cantidad + 1 } : p
    );
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0
  );
  document.getElementById("contador-carrito").textContent = contador;
}

// Cargar los productos cuando la página se carga
window.onload = function () {
  cargarProductos();
  actualizarContadorCarrito();
};
