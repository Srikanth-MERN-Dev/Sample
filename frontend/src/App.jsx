import './App.css'
import Home from './components/Home'
import Navbar from './components/Navbar'
import AuthPage from './components/AuthPage'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Footer from './components/Footer'
import ProductMenu from './components/ProductMenu'
import Profile from './components/Profile'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Adminpanel from './components/Adminpanel'
import Orders from './components/MyOrders'


function App() {
  return (
    <Router>
       <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-fill">
          <Routes>
            <Route path='/' element={ <Home /> } />
            <Route path='/login' element={ <AuthPage/> } />
            <Route path='/productmenu' element={ <ProductMenu/> } />
            <Route path='/register' element={ <AuthPage/> } />
            <Route path='/profile' element={ <Profile /> } />
            <Route path='/cart' element={ <Cart /> } />
            <Route path='/checkout' element={ <Checkout /> } />
            <Route path='/adminpanel' element={ <Adminpanel /> } />
            <Route path='/orders' element={ <Orders /> } />
          </Routes>
        </main>
       <Footer/>
      </div>
    </Router>
  )
}

export default App