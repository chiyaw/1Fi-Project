import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Home from './components/Home';
import { ROUTER_CONFIG } from './constant';

function App() {
  return (
    <Router future={ROUTER_CONFIG.FUTURE}>
      <div className="w-full min-h-screen flex bg-gray-50">
        <Routes>
          <Route path="/" element={
            <>
              <ProductList />
              <Home />
            </>
          } />
          <Route path="/product/:productId" element={
            <>
              <ProductList />
              <ProductDetail />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
