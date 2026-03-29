import './App.css';
import Navbar from './components/header/Navbar';
import NewNav from './components/newnavbar/NewNav';
import MainComponent from './components/Home/MainComponent';
import Footer from './components/Footer/Footer';
import SignIn from './components/SignUp_SignIn/SignIn';
import SignUp from './components/SignUp_SignIn/SignUp';
import Cart from './components/Cart/Cart';
import BuyNow from './components/BuyNow/BuyNow';
import ShoppingCart from './components/ShoppingCart/ShoppingCart';
import Checkout from './components/Checkout/Checkout';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation';
import OrderHistory from './components/OrderHistory/OrderHistory';
import OrderDetails from './components/OrderDetails/OrderDetails';
import SearchResults from './components/Search/SearchResults';
import ProtectedRoute from './components/ProtectedRoute';
import {Routes , Route} from 'react-router-dom'; 

function App() {
  return (
    <>
    <Navbar/>
    <NewNav/>
    <Routes>
      <Route path='/' element={<MainComponent/>}/>
      <Route path='/login' element={<SignIn/>}/>
      <Route path='/register' element={<SignUp/>}/>
      
      {/* Search Route */}
      <Route path='/search' element={<SearchResults/>}/>
      
      {/* Product Routes */}
      <Route path='/products/:id' element={<Cart/>}/>
      <Route path='/getProducts/:id' element={<Cart/>}/>
      
      {/* Cart Routes */}
      <Route path='/cart' element={
        <ProtectedRoute>
          <ShoppingCart/>
        </ProtectedRoute>
      }/>
      
      {/* Checkout Routes */}
      <Route path='/checkout' element={
        <ProtectedRoute>
          <Checkout/>
        </ProtectedRoute>
      }/>
      
      {/* Order Routes */}
      <Route path='/order-confirmation/:orderId' element={
        <ProtectedRoute>
          <OrderConfirmation/>
        </ProtectedRoute>
      }/>
      
      <Route path='/orders' element={
        <ProtectedRoute>
          <OrderHistory/>
        </ProtectedRoute>
      }/>
      
      <Route path='/orders/:orderId' element={
        <ProtectedRoute>
          <OrderDetails/>
        </ProtectedRoute>
      }/>
      
      {/* Legacy Route */}
      <Route path='/buynow' element={<BuyNow/>}/>
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
