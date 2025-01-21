/* hook used to consume data from a context object created by createContext
use this hook inside my component to retrieve the data that I need 
hook accepts the context object as an argument */
import { useContext } from "react";
import { ShopContext } from "../App";
// import { Link } from "react-router-dom";

function Links() {
  /* gets cartItems directly in the Links component, no matter how deeply 
  nested the component is, as long as this component is nested inside the 
  Provider 
  useContext() accesses cartItems from the ShopContext 
  
  useContext() call in a component is not affected  by providers returned 
  from the same component, the corresponding Context.Provider needs to be
  above the component doing the useContext() call */
  const { cartItems } = useContext(ShopContext);
  return (
    <ul>
      {/* Links */}
      <li>
        {/* <Link to="Link to the cart">
          <span>Cart</span>
          <div className="cart-icon">{cartItems.length}</div>
        </Link> */}
      </li>
    </ul>
  );
}

export default function Header() {
  return (
    <header>
      {/* Other header elements*/}
      <nav>
        <Links />
      </nav>
    </header>
  );
}
