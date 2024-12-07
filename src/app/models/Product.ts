export type Product = {
  id: number,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string,
  rating: {
    rate: number,
    count: number
  },
  quantity: number // Custom Variable, isnt included in the fakestoreapi product
}

export function createTestProduct(data: Partial<Product>): Product {
  return {
    id: 999,
    title: "Test Product",
    price: 100,
    description: "Test Product Description",
    category: "Test Category",
    image: "image src",
    rating: { rate: 1, count: 20 },
    quantity: 1, // Default values

    ...data, // Override defaults with provided values
  };
}