import { Product, Category } from '@features/products/model/types';

const categories: Category[] = ['Food', 'Beverage', 'Other'];

const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const names = [
  'Organic Apples',
  'Dark Coffee',
  'Premium Pasta',
  'Sparkling Water',
  'Canned Soup',
  'Almond Milk',
  'Chocolate Biscuits',
  'Petroleum Jelly',
  'Gourmet Tea',
  'Protein Bar',
  'Healthy Seeds',
  'Yoga Mat',
  'Mountain Bike',
  'Wireless Earbuds',
  'Laptop Stand',
  'Office Chair',
  'Smartphone Case',
  'Notebook',
  'Eco Bottle',
  'Bluetooth Speaker',
];

const randomCategory = () => categories[getRandom(0, categories.length - 1)];

const randomDate = () => {
  const after = new Date();
  after.setMonth(after.getMonth() - 6);
  const before = new Date();
  const timestamp = getRandom(after.getTime(), before.getTime());
  return new Date(timestamp).toISOString();
};

const ProductMockData: Product[] = Array.from({ length: 30 }, (_, idx) => {
  const name = `${names[getRandom(0, names.length - 1)]} ${idx + 1}`;
  const randomDateValue = randomDate();
  const updatedAt = new Date(new Date(randomDateValue).getTime() + getRandom(0, 400) * 60 * 60 * 1000).toISOString();

  return {
    id: `product-${idx + 1}`,
    name,
    category: randomCategory(),
    price: Number((Math.random() * 100).toFixed(2)),
    isActive: Math.random() > 0.2,
    updatedAt,
  };
});

export default ProductMockData;
