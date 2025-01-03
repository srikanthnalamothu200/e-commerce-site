// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/user/userSlice';
import productsReducer from '../features/products/productsSlice';
import ordersReducer from '../features/orders/ordersSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    products: productsReducer,
    orders: ordersReducer,
  },
});

// src/features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('cart')) || [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.find(i => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.push(item);
      }

      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeItem: (state, action) => {
      const newState = state.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    },
    clearCart: () => {
      localStorage.removeItem('cart');
      return [];
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

// src/features/products/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  status: 'idle',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;

// src/features/orders/ordersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Auth from './components/Auth';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Auth />
        <ProductList />
        <Cart />
      </div>
    </Provider>
  );
}

export default App;

// src/components/ProductList.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../features/cart/cartSlice';

function ProductList() {
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addItem({ ...product, quantity: 1 }));
  };

  return (
    <div>
      <h2>Product List</h2>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;

// src/components/Cart.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, clearCart } from '../features/cart/cartSlice';

function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Cart</h2>
      {cart.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </div>
      ))}
      <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
    </div>
  );
}

export default Cart;

// src/components/Auth.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../features/user/userSlice';

function Auth() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  return (
    <div>
      {user ? (
        <button onClick={() => dispatch(logout())}>Logout</button>
      ) : (
        <button onClick={() => dispatch(login({ user: 'John Doe', token: '12345' }))}>
          Login
        </button>
      )}
    </div>
  );
}

export default Auth;
