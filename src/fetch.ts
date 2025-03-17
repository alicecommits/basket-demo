export async function fetchProducts() {
  try {
    const resp = await fetch("https://fakestoreapi.com/products");
    return await resp.json();
  } catch (err) {
    console.error(err);
    return "err";
  }
}
