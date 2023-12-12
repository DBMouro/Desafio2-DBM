const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(nuevoObjeto) {
    let { title, description, price, img, code, stock } = nuevoObjeto;

    if (!title || !description || !price || !img || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("El código debe ser único");
      return;
    }

    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    this.products.push(newProduct);

    await this.guardarArchivo(this.products);
  }

  getProducts() {
    console.log(this.products);
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);

      if (!buscado) {
        console.log("Producto no encontrado");
      } else {
        console.log("¡Sí, lo encontramos!");
        return buscado;
      }
    } catch (error) {
      console.log("Error al leer el archivo ", error);
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer un archivo", error);
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1, productoActualizado);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
        console.log("Producto eliminado correctamente");
      } else {
        console.log("No se encontró el producto con el ID especificado");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

const manager = new ProductManager("./productos.json");

manager.getProducts();

const alfajores = {
  title: "alfajores",
  description: "con mucho dulce",
  price: 150,
  img: "sin imagen",
  code: "abc123",
  stock: 30,
};

manager.addProduct(alfajores);

const chocolate = {
  title: " chocolate",
  description: "con nuez",
  price: 250,
  img: "sin imagen",
  code: "abc124",
  stock: 30,
};

manager.addProduct(chocolate);

const queso = {
  title: "queso",
  description: "cremoso",
  price: 15000,
  img: "sin imagen",
  code: "abc125",
};

manager.getProducts();

async function testeamosBusquedaPorId() {
  const buscado = await manager.getProductById(2);
  console.log(buscado);
}

testeamosBusquedaPorId();

const gaseosa = {
  id: 1,
  title: "gaseosa limon",
  description: "con mucho gas",
  price: 150,
  img: "sin imagen",
  code: "abc123",
  stock: 30,
};

async function testeamosActualizar() {
  await manager.updateProduct(1, gaseosa);
}

testeamosActualizar();

async function testeamosEliminar() {
  await manager.deleteProduct(1);
  manager.getProducts();
}

testeamosEliminar();
