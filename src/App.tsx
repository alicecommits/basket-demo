import { useMemo, useState } from "react";
import { fetchProducts } from "./fetch";
import "./App.css";

interface Product {
  id: number;
  image: string;
  price: number; //float?
  title: string;
  description: string;
}
interface ProductInfo {
  id: number;
  price: number;
  title: string;
}
type Quantity = Record<string, number>;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductInfo[]>([]);
  const [productQty, setProductQty] = useState<Quantity>({});

  // Calculate total using useMemo - only recalculates when dependencies change
  const memoizedTotalInvoice = useMemo(() => {
    console.log("Calculating total with useMemo");
    let total = 0;

    // Loop through all products to calculate total
    for (const product of products) {
      const quantity = productQty[product.id] || 0;
      total += product.price * quantity;
    }

    // Return calculated total rounded to 2 decimal places
    return parseFloat(total.toFixed(2));
  }, [productQty, products]); // Dependencies - recalculate when these change

  async function triggerFetch() {
    const results = await fetchProducts();
    if (results === "err") {
      // do the error handling
    }
    const productData = results.map((record: any) => {
      return {
        id: record.id,
        image: record.image,
        price: record.price,
        title: record.title,
        description: record.description,
      };
    });
    console.log("products :", productData);
    setProducts(productData);
  }

  // when a dynamically generated button is clicked,
  // this function gets the info of the corresponding product
  // dynamically generated from products.map((product) => {...})
  function handleProductSelect(product: Product) {
    // first, quantities
    setProductQty((prevQty: any) => {
      // new object to avoid state mutation
      const newQty = { ...prevQty };
      // if exists in our object, increment, else init to 1
      newQty[product.id] = (newQty[product.id] || 0) + 1;

      return newQty;
    });

    const productIdToLookUp = product.id;
    const isProductInSelectedProducts = selectedProducts.some(
      (product) => product.id === productIdToLookUp
    );
    // add the product only if the existing product wasn't selected before
    if (!isProductInSelectedProducts) {
      setSelectedProducts([
        ...selectedProducts,
        { id: product.id, price: product.price, title: product.title },
      ]);
    }
  }

  // for this one, no need to pass the entire product info
  // the product ID is enough
  function handleRemoveProduct(productIdAsInt: number) {
    const productId = productIdAsInt.toString();

    // don't forget to return within the arrow function
    setProductQty((prevQty: Quantity) => {
      // Create new object to avoid direct state mut
      const newQty = { ...prevQty };
      // If product already exists, decrement
      if (newQty[productId] && newQty[productId] > 0) {
        newQty[productId] -= 1;
      }

      // If product reaches 0, keep at 0 for trace it was selected
      if (newQty[productId] === 0) {
        newQty[productId] = 0;
      }

      return newQty;
    });

    // If product qty is now 0, remove product from array
    // don't forget to return within the arrow function
    setProductQty((currentQty: Quantity) => {
      if (currentQty[productId] < 1) {
        const selectedProductsMinusProductId = selectedProducts.filter(
          (product) => product.id !== productIdAsInt
        );
        setSelectedProducts(selectedProductsMinusProductId);
      }

      return currentQty;
    });
  }

  function getProductQuantity(productIdAsInt: number) {
    const productId = productIdAsInt.toString();
    return productQty[productId] || 0;
  }

  return (
    <>
      <button onClick={triggerFetch}>Fetch products</button>
      <h1>My basket demo in React/TypeScript</h1>
      <h3 className="read-the-docs">...and building with Vite!</h3>
      <div id="products-container">
        <table id="products-table">
          <tbody id="products-table-body">
            <tr id="products-row">
              {products.length ? (
                products.map((product) => (
                  <td key={product.id}>
                    <img
                      key={product.id}
                      src={product.image}
                      alt={product.description}
                      width="25%"
                    />
                    <br />
                    <i key={product.id}>{product.price}$ only</i>
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.title}
                    </button>
                  </td>
                ))
              ) : (
                <td>
                  <i>This will get the array of img (or alt txt) + buttons</i>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      <h2>My current basket</h2>
      <div id="basket-container">
        {/* if uses { selectedProducts.length && (...) syntax 
        it will display the 'null' as a 0! what we saw last year */}
        {selectedProducts.length ? (
          <ul id="basket-list">
            {selectedProducts.map((product, index) => (
              <li key={index}>
                {getProductQuantity(product.id)}x {product.title}
                <button
                  key={product.id}
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  Remove product
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <h3>My current invoice</h3>
      <h4>Total: ${memoizedTotalInvoice}</h4>
    </>
  );
}

export default App;
