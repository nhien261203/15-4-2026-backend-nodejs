require("dotenv").config();
const sequelize = require("../src/config/database");
const { Product, Category } = require("../src/models");

const seedProducts = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    // Get category IDs
    const dogCat = await Category.findOne({ where: { name: "Dog", type: "pet" } });
    const catCat = await Category.findOne({ where: { name: "Cat", type: "pet" } });
    const foodCat = await Category.findOne({ where: { name: "Food", type: "product" } });
    const toysCat = await Category.findOne({ where: { name: "Toys", type: "product" } });
    const accCat = await Category.findOne({ where: { name: "Accessories", type: "product" } });

    const products = [
      // Dog products
      {
        name: "Royal Canin Medium Adult Dog Food",
        description: "Premium dry food for medium breed adult dogs",
        price: 450000,
        quantity: 50,
        brand: "Royal Canin",
        image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&h=300&fit=crop",
        categoryId: foodCat ? foodCat.id : null,
      },
      {
        name: "Pedigree Adult Dog Food Chicken Flavor",
        description: "Nutritious dog food with real chicken",
        price: 250000,
        quantity: 100,
        brand: "Pedigree",
        image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=300&h=300&fit=crop",
        categoryId: foodCat ? foodCat.id : null,
      },
      {
        name: "Kong Classic Dog Toy",
        description: "Durable rubber toy for dogs",
        price: 150000,
        quantity: 30,
        brand: "Kong",
        image: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=300&h=300&fit=crop",
        categoryId: toysCat ? toysCat.id : null,
      },
      {
        name: "PetSafe Nylon Dog Collar",
        description: "Adjustable nylon collar with buckle",
        price: 80000,
        quantity: 75,
        brand: "PetSafe",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
        categoryId: accCat ? accCat.id : null,
      },
      // Cat products
      {
        name: "Whiskas Adult Cat Food Tuna",
        description: "Tasty tuna flavor cat food",
        price: 200000,
        quantity: 80,
        brand: "Whiskas",
        image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=300&h=300&fit=crop",
        categoryId: foodCat ? foodCat.id : null,
      },
      {
        name: "Friskies Party Mix Cat Treats",
        description: "Delicious treats for cats",
        price: 120000,
        quantity: 60,
        brand: "Friskies",
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop",
        categoryId: foodCat ? foodCat.id : null,
      },
      {
        name: "Catnip Toys Set",
        description: "Set of catnip filled toys",
        price: 100000,
        quantity: 40,
        brand: "Generic",
        image: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=300&h=300&fit=crop",
        categoryId: toysCat ? toysCat.id : null,
      },
      {
        name: "Litter Box with Scoop",
        description: "Plastic litter box with matching scoop",
        price: 180000,
        quantity: 25,
        brand: "Generic",
        image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300&h=300&fit=crop",
        categoryId: accCat ? accCat.id : null,
      },
    ];

    for (const prod of products) {
      const existing = await Product.findOne({ where: { name: prod.name } });
      if (!existing) {
        await Product.create(prod);
        console.log(`Created product: ${prod.name}`);
      } else {
        console.log(`Product ${prod.name} already exists`);
      }
    }

    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    await sequelize.close();
  }
};

seedProducts();