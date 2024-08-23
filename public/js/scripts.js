const btnsAgregar = document.querySelectorAll(".btn-agregar");
btnsAgregar.forEach((btn) => {
    btn.addEventListener("click", (e) => {


        
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let itemId = e.target.id;
        let itemTitle = e.target.title;
        let itemPrice = e.target.getAttribute('price'); // Accede al atributo price
        let itemDescuento = e.target.getAttribute('descuento'); // Accede al atributo descuento
        let itemIndex = carrito.findIndex(item => item.id === itemId); // si existe el item en el carrito devuelve 0 y si no existe devuelve -1
   
        if (itemIndex === -1) {
            carrito.push({
                id: itemId,
                cantidad: 1,
                title: itemTitle,
                price: itemPrice,
                descuento: itemDescuento // Accede al precio usando dataset
            });
        }

            // CON LIBRERIA AGREGAMOS UN EFECTO
        Toastify({
            text: "Se agrego: " + itemTitle.toString(),
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        
        localStorage.setItem("carrito", JSON.stringify(carrito)); // Guarda el carrito actualizado en localStorage
         console.log(carrito);
        // console.log(itemDescuento); // Muestra el precio en la consola



    });
});

