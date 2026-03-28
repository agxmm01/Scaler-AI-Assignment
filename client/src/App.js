import './App.css';
import Navbar from './components/header/Navbar';
import NewNav from './components/newnavbar/NewNav';
import MainComponent from './components/Home/MainComponent';
import Footer from './components/Footer/Footer';
import SignIn from './components/SignUp_SignIn/SignIn';
import SignUp from './components/SignUp_SignIn/SignUp';
import Cart from './components/Cart/Cart';
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
      <Route path='/getProducts/:id' element={<Cart/>}/>
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
