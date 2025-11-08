import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Home from './components/Home';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
