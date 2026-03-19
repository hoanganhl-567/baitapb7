let productModel = require('../schemas/products');
const Inventory = require('../schemas/inventory');

module.exports = {

  CreateProduct: async function (name, price) {
    // 1. tạo product
    let newProduct = new productModel({
      name: name,
      price: price
    });

    await newProduct.save();

    // 2. 🔥 TỰ ĐỘNG tạo inventory
    await Inventory.create({
      product: newProduct._id
    });

    return newProduct;
  }

};