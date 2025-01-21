import { useContext } from "react";
import { ShopContext } from "../App";

export default function ProductDetail() {
  // useContext() accesses products and addToCart from the ShopContext
  const { products, addToCart } = useContext(ShopContext);
  let product; // products.find(/* logic to find the specific product */);
  return (
    <div>
      Image of the product
      <div>
        {/* element sthat align with the design */}
        <button type="button" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
