import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Fragment, useEffect, useState } from 'react';
import axios from "axios";
import ProductContext from "./contexts/ProductsContext.js";
import PanierContext from "./contexts/PanierContext.js";
import { Home } from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { DashboardAdmin } from './components/DashboardAdmin.jsx';
import { AuthContext } from "./contexts/AuthContext.js";
import { UserContext } from "./contexts/UserContext.js";
import { ProtectedRoute } from "./protected/ProtectedRoute.js";
import Connection from "./components/Connection.jsx";
import NavBar from "./components/NavBar.jsx";
import Products from "./components/Products.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Favoris from "./components/Favoris.jsx";
import Panier from "./components/Panier.jsx";
import Footer from "./components/Footer.jsx";
import MonCompte from "./components/Moncompte.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  
  const [cartItems, setCartItems] = useState(() => {
    const localItems = localStorage.getItem('items');
    return localItems ? JSON.parse(localItems) : [];
  });

  const getProducts = () => {
    axios.get('http://localhost:8000/products')
    .then(response => {
        setProducts(response.data)
    })
}

const onAdd = async (product) => {
  const exist = cartItems.find((x) => x.id === product.id);
  if (exist) {
    await  setCartItems(
      cartItems.map((x) =>
        x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
      )
    )
    localStorage.setItem('items', JSON.stringify(cartItems.map((x) =>
    x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
  )));
  } else {
    await setCartItems([...cartItems, { ...product, qty: 1 }]);
    localStorage.setItem('items', JSON.stringify([...cartItems, { ...product, qty: 1 }]));
  }
};


const onRemove = (product) => {
  const exist = cartItems.find((x) => x.id === product.id);
  if (exist.qty === 1) {
    localStorage.setItem('items', JSON.stringify((cartItems.filter((x) => x.id !== product.id))));
    setCartItems(cartItems.filter((x) => x.id !== product.id));
  } else {
    setCartItems(
      cartItems.map((x) =>
        x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
        );
  } 
};


console.log(products)
console.log('cartitems', cartItems)


useEffect(() => {
  getProducts();
  getUser();
}, []);


const getUser = () => {
  const token = localStorage.getItem('token');
  console.log('token', token)
  if (token) {
    axios
    .get('http://localhost:8000/user', {
        headers: {
          'x-access-token': token,
        },
      })
      .then(({ data }) => {
        console.log('data', data)
        if (data) {
          setIsAuthenticated(true);
          setUser(JSON.parse(localStorage.getItem('user')));
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
  }
};

console.log(isAuthenticated)


  return (
    <>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        <UserContext.Provider value={{ user, setUser }}>
        <ProductContext.Provider value={{ products : products }}>
          <PanierContext.Provider value={{cartItems: cartItems, products : products, onAdd: onAdd, onRemove: onRemove}}>
          <BrowserRouter>
            <NavBar isAuthenticated={isAuthenticated} cartItems={cartItems} />
          
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/products" element={<Products  cartItems={cartItems}/>} />
              <Route exact path="/products/:id" element={<ProductDetails  cartItems={cartItems}/>} />
              <Route path="/connexion" element={<Connection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/monpanier" element={<Panier />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<ProtectedRoute/>} />
              <Route path="/favoris" element={<Favoris/>} />
              <Route path="/moncompte" element={<MonCompte/>} />
                <Route path="/admin" element={<DashboardAdmin />} />
          
            </Routes>
            <Footer />
          </BrowserRouter>
          </PanierContext.Provider>
          </ProductContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
