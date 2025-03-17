export interface OriginalProductsRecord {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
interface Rating {
  rate: number;
  count: number;
}
export async function fetchProducts(): Promise<OriginalProductsRecord[]> {
  try {
    const resp = await fetch("https://fakestoreapi.com/products");
    return await resp.json();
  } catch (err) {
    console.error(err);
    // quick handling
    return [
      {
        id: 0,
        title: "err fetch",
        price: 0,
        description: "err",
        category: "err",
        image: "err",
        rating: {
          rate: 0,
          count: 0,
        },
      },
    ];
  }
}
