import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav>
      <div className="container">
        <Link to="/">
          <h1>🛒 Local Cart Store</h1>
        </Link>
        <ul>
          <li>
            <Link to="/">Products</Link>
          </li>
          <li>
            <Link to="/cart">
              Cart <span className="cart-badge">{getTotalItems()}</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/login">Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

