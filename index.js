 const express = require('express');
 const pug = require("pug");
 const app = express();
 const traductor = require("node-google-translate-skidz");
 const fs = require("fs").promises;

 app.use(express.static('public'));
 app.use(express.urlencoded( {extended: true}));
 app.use(express.json());

 app.set('view engine', 'pug');
 app.set('views', './vistas');

 async function  traducir(texto){
     const traduccion = await traductor({
         text: texto,
         source: 'en',
         target: 'es',
       });
        return traduccion.translation;
 }

 app.get("/", async (req, res) => {
     const response = await fetch("https://fakestoreapi.com/products");
     const productos = await response.json();

     // traducir titulo y descripcion
     for (producto of productos) {
         producto.title = await traducir(producto.title);
         producto.description = await traducir(producto.description);
         producto.category = await traducir(producto.category);
     }

     // aplicar decuenstos
      let descuentos = await fs.readFile("descuentos.json");
      descuentos = JSON.parse(descuentos);

      let desc;
    for( producto of productos){
         desc = descuentos.filter(descuento => {
            return  descuento.id === producto.id;
        });
        if(desc.length > 0){
            producto.descuento = desc[0].descuento;
        }
    }
     res.render("index", { productos: productos });
 });

 app.get('/carrito', async (req,  res) => {
    const response = await fetch("https://fakestoreapi.com/products");
    const producto = await response.json();
    res.render("carrito");
 });

 app.post("/comprar", async (req, res) => {

    try{
        const compra = req.body;
        // console.log(compra)
        let compras = await fs.readFile('compras.json');
        compras = JSON.parse(compras);

        compras.push({compra});

        await fs.writeFile('compras.json', JSON.stringify(compras));
        res.json({error: false, massage: "Se registro la compra"});
    }
        catch(error){
            res.json({error: true, massage: error.massage});
        }
 });

 app.listen(3000, () => {
     console.log("Servidor corriendo en el puerto 3000")
 });

