export type Product = {
  id: string;
  name: string;
  weight: string;
  price: number;
  icon: string;
  detail?: string;
  nutrition?: { calories: string; fat: string; sugar: string; protein: string };
};

export const ALL_PRODUCTS: Product[] = [
  { id: '1', name: 'Organic Broccoli', weight: '1kg', price: 4.99, icon: '🥦', detail: 'Fresh organic broccoli, rich in vitamins and fiber.', nutrition: { calories: '34kcal', fat: '0.4g', sugar: '2g', protein: '2.8g' } },
  { id: '2', name: 'Crimson Tomato', weight: '1kg', price: 4.99, icon: '🍅', detail: 'Bananas are among the world\'s most popular fruit.', nutrition: { calories: '89kcal', fat: '0.3g', sugar: '12g', protein: '1.1g' } },
  { id: '3', name: 'Beef Bone', weight: '1kg', price: 5.99, icon: '🥩', detail: 'Fresh beef bone, great for soups and broths.', nutrition: { calories: '120kcal', fat: '8g', sugar: '0g', protein: '11g' } },
  { id: '4', name: 'Broiler Chicken', weight: '1kg', price: 6.99, icon: '🍗', detail: 'Fresh broiler chicken, high in protein and low in fat.', nutrition: { calories: '165kcal', fat: '3.6g', sugar: '0g', protein: '31g' } },
  { id: '5', name: 'Bell Pepper', weight: '1kg', price: 3.99, icon: '🫑', detail: 'Fresh bell peppers, rich in vitamins A and C.', nutrition: { calories: '31kcal', fat: '0.3g', sugar: '4g', protein: '1g' } },
  { id: '6', name: 'Ginger', weight: '250g', price: 2.99, icon: '🫚', detail: 'Fresh ginger root, great for cooking and health.', nutrition: { calories: '80kcal', fat: '0.8g', sugar: '1.7g', protein: '1.8g' } },
  { id: '7', name: 'Egg Chicken', weight: '4pcs', price: 1.99, icon: '🥚', detail: 'Fresh eggs, rich in protein and vitamins.', nutrition: { calories: '78kcal', fat: '5g', sugar: '0g', protein: '6g' } },
  { id: 'b1', name: 'Diet Coke', weight: '335ml', price: 1.99, icon: '🥤', detail: 'Refreshing diet cola with zero sugar.', nutrition: { calories: '1kcal', fat: '0g', sugar: '0g', protein: '0g' } },
  { id: 'b2', name: 'Sprite Can', weight: '325ml', price: 1.50, icon: '🧃', detail: 'Crisp and refreshing lemon-lime soda.', nutrition: { calories: '140kcal', fat: '0g', sugar: '38g', protein: '0g' } },
  { id: 'b3', name: 'Apple & Grape Juice', weight: '2L', price: 15.99, icon: '🍹', detail: 'Fresh apple and grape juice blend.', nutrition: { calories: '120kcal', fat: '0g', sugar: '28g', protein: '0g' } },
  { id: 'b4', name: 'Orange Juice', weight: '2L', price: 15.99, icon: '🍊', detail: 'Freshly squeezed orange juice.', nutrition: { calories: '112kcal', fat: '0g', sugar: '26g', protein: '2g' } },
  { id: 'b5', name: 'Coca Cola Can', weight: '325ml', price: 4.99, icon: '🥤', detail: 'Classic Coca Cola.', nutrition: { calories: '139kcal', fat: '0g', sugar: '35g', protein: '0g' } },
  { id: 'b6', name: 'Pepsi Can', weight: '330ml', price: 4.99, icon: '🥤', detail: 'Classic Pepsi cola.', nutrition: { calories: '150kcal', fat: '0g', sugar: '41g', protein: '0g' } },
  { id: 'f1', name: 'Red Apple', weight: '1kg', price: 1.99, icon: '🍎', detail: 'Fresh red apples.', nutrition: { calories: '52kcal', fat: '0.2g', sugar: '10g', protein: '0.3g' } },
  { id: 'f2', name: 'Egg Chicken White', weight: '180g', price: 1.50, icon: '🥚', detail: 'Fresh white eggs.', nutrition: { calories: '78kcal', fat: '5g', sugar: '0g', protein: '6g' } },
  { id: 'f3', name: 'Organic Bananas', weight: '5kg', price: 3.00, icon: '🍌', detail: 'Organic crimson tomatoes.', nutrition: { calories: '18kcal', fat: '0.2g', sugar: '2.6g', protein: '0.9g' } },
  { id: 'o1', name: 'Olive Oil', weight: '1L', price: 8.99, icon: '🫒', detail: 'Premium extra virgin olive oil.', nutrition: { calories: '884kcal', fat: '100g', sugar: '0g', protein: '0g' } },
  { id: 'o2', name: 'Sunflower Oil', weight: '2L', price: 5.99, icon: '🌻', detail: 'Pure sunflower cooking oil.', nutrition: { calories: '884kcal', fat: '100g', sugar: '0g', protein: '0g' } },
  { id: 'm1', name: 'Beef Bone', weight: '1kg', price: 5.99, icon: '🥩', detail: 'Fresh beef bone for soups.', nutrition: { calories: '120kcal', fat: '8g', sugar: '0g', protein: '11g' } },
  { id: 'm2', name: 'Broiler Chicken', weight: '1kg', price: 6.99, icon: '🍗', detail: 'Fresh broiler chicken.', nutrition: { calories: '165kcal', fat: '3.6g', sugar: '0g', protein: '31g' } },
  { id: 'bk1', name: 'White Bread', weight: '400g', price: 2.50, icon: '🍞', detail: 'Soft and fresh white bread.', nutrition: { calories: '265kcal', fat: '3.2g', sugar: '5g', protein: '9g' } },
  { id: 'bk2', name: 'Croissant', weight: '200g', price: 3.99, icon: '🥐', detail: 'Buttery and flaky croissant.', nutrition: { calories: '406kcal', fat: '21g', sugar: '11g', protein: '8g' } },
  { id: 'd1', name: 'Fresh Milk', weight: '1L', price: 1.99, icon: '🥛', detail: 'Fresh full cream milk.', nutrition: { calories: '61kcal', fat: '3.3g', sugar: '4.8g', protein: '3.2g' } },
  { id: 'd2', name: 'Butter', weight: '250g', price: 3.50, icon: '🧈', detail: 'Creamy unsalted butter.', nutrition: { calories: '717kcal', fat: '81g', sugar: '0g', protein: '0.9g' } },
  { id: 'd3', name: 'Eggs Duck', weight: '12pcs', price: 2.99, icon: '🥚', detail: 'Fresh farm eggs.', nutrition: { calories: '78kcal', fat: '5g', sugar: '0g', protein: '6g' } },
  { id: 'p1', name: 'Red Lentils', weight: '1kg', price: 2.99, icon: '🫘', detail: 'Dried red lentils, high in protein.', nutrition: { calories: '352kcal', fat: '1g', sugar: '2g', protein: '25g' } },
  { id: 'p2', name: 'Chickpeas', weight: '1kg', price: 3.49, icon: '🫘', detail: 'Dried chickpeas, great for curries.', nutrition: { calories: '364kcal', fat: '6g', sugar: '11g', protein: '19g' } },
  { id: 'r1', name: 'Basmati Rice', weight: '2kg', price: 5.99, icon: '🍚', detail: 'Premium basmati rice.', nutrition: { calories: '360kcal', fat: '0.9g', sugar: '0g', protein: '7g' } },
  { id: 'r2', name: 'Jasmine Rice', weight: '2kg', price: 4.99, icon: '🍚', detail: 'Fragrant jasmine rice.', nutrition: { calories: '356kcal', fat: '0.6g', sugar: '0g', protein: '7g' } },
];

export const PRODUCTS_MAP: Record<string, Product> = Object.fromEntries(
  ALL_PRODUCTS.map(p => [p.id, p])
);