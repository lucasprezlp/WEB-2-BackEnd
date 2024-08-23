document.addEventListener("DOMContentLoaded", function () {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const lista = document.getElementById("carrito-lista");
  const totalCompra = document.getElementById("total-compra");
  const btnCompra = document.getElementById("btn-compra");

  function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function calcularPrecio(producto) {
    let precioUnitario = parseFloat(producto.price) || 0;
    let precioTotal = precioUnitario * producto.cantidad;
    if (producto.descuento) {
      precioTotal -= precioTotal * (producto.descuento / 100);
    }
    return precioTotal.toFixed(2); // para mantener dos decimales
  }

  function calcularTotalCompra() {
    let total = 0;
    carrito.forEach(producto => {
      total += parseFloat(calcularPrecio(producto)); // seria mejor un reduce 
    });
    return total.toFixed(2);
  }

  function renderCarrito() {
    lista.innerHTML = '';
    if (carrito.length > 0) {
      carrito.forEach((producto, index) => {
        const li = document.createElement("li");
        li.classList.add("carrito-item");

        const pId = document.createElement("p");
        pId.textContent = `ID: ${producto.id}`;

        const pTitle = document.createElement("p");
        pTitle.textContent = `Producto: ${producto.title}`;

        const pCantidad = document.createElement("p");
        pCantidad.textContent = `Cantidad: ${producto.cantidad}`;

        const pPrecio = document.createElement("p");
        pPrecio.textContent = `Precio: ${calcularPrecio(producto)} $`;

        const btnIncrementar = document.createElement("button");
        btnIncrementar.textContent = "+";
        btnIncrementar.addEventListener("click", () => {
          producto.cantidad++;
          pCantidad.textContent = `Cantidad: ${producto.cantidad}`;
          pPrecio.textContent = `Precio: ${calcularPrecio(producto)} $`;
          totalCompra.textContent = `Total de la compra: ${calcularTotalCompra()} $`;
          actualizarCarrito();
        });

        const btnDecrementar = document.createElement("button");
        btnDecrementar.textContent = "-";
        btnDecrementar.addEventListener("click", () => {
          if (producto.cantidad > 0) {
            producto.cantidad--;
            pCantidad.textContent = `Cantidad: ${producto.cantidad}`;
            pPrecio.textContent = `Precio: ${calcularPrecio(producto)} $`;
            totalCompra.textContent = `Total de la compra: ${calcularTotalCompra()} $`;
            actualizarCarrito();
          }
        });

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => {

          Toastify({
            text: "Se elimino el producto" + producto.title,
            className: "info",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
          }).showToast();

          carrito.splice(index, 1);
          renderCarrito();
          totalCompra.textContent = `Total de la compra: ${calcularTotalCompra()} $`;
          actualizarCarrito();
        });

        // li.appendChild(pId);
        li.appendChild(pTitle);
        li.appendChild(pCantidad);
        li.appendChild(btnIncrementar);
        li.appendChild(btnDecrementar);
        li.appendChild(btnEliminar);
        li.appendChild(pPrecio);

        let pDescuento;
        if (producto.descuento) {
          pDescuento = document.createElement("p");
          pDescuento.innerHTML = `<strong>Descuento aplicado: ${producto.descuento}%</strong>`;
          pDescuento.classList.add("descuento");
          li.appendChild(pDescuento);
        }

        lista.appendChild(li);
      });
      totalCompra.textContent = `Total de la compra: ${calcularTotalCompra()} $`;
    } else {
      const li = document.createElement("li");
      li.textContent = "El carrito está vacío.";
      lista.appendChild(li);
      totalCompra.textContent = "Total de la compra: 0.00 $";
    }
  }

  compra.addEventListener("click", () => {
    if (carrito.length > 0) {
      fetch("/comprar", {
        method: "POST", // "POST" debe ser una cadena
        headers: {
          "Content-Type": "application/json" // hay que asegurarse de que el establecer el encabezado Content-Type
        },
        body: JSON.stringify(carrito) // Enviar el carrito como cuerpo de la solicitud
      }).then(response => response.json()).then(
        result => {
          if (result.error) {
            // Manejar el error si la compra no se pudo realizar
            alert("Error al realizar la compra: " + result.message);
          } else {
            // Manejar el caso en que la compra se realizó correctamente
            alert("Compra realizada con éxito");
            carrito.length = 0; // carrito vacio
            actualizarCarrito();
            renderCarrito();
          }
        }
      );
    } else {
      alert("El carrito está vacío. No se puede realizar la compra.");
    }
  });

  renderCarrito();
});


