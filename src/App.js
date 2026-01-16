import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import MenuPage from "./pages/MenuPage/MenuPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Contact from "./pages/Contact/Contact";
import Cart from "./pages/Cart/Cart";
import Checkout from './pages/Checkout/Checkout';
import OffersPage from "./pages/OffersPage/OffersPage";
import Vegetarian from "./pages/CategoryPages/Vegetarian/Vegetarian";
import NonVegetarian from "./pages/CategoryPages/NonVegetarian/NonVegetarian";
import SouthIndian from "./pages/CategoryPages/SouthIndian/SouthIndian";
import Starters from "./pages/CategoryPages/Starters/Starters";
import MainCourse from "./pages/CategoryPages/MainCourse/MainCourse";
import Desserts from "./pages/CategoryPages/Desserts/Desserts";
import Beverages from "./pages/CategoryPages/Beverages/Beverages";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
             <Route path="/checkout" element={<Checkout />} />
            <Route path="/category/veg" element={<Vegetarian />} />
            <Route path="/category/non-veg" element={<NonVegetarian />} />
            <Route path="/category/south-indian" element={<SouthIndian />} />
            <Route path="/category/starters" element={<Starters />} />
            <Route path="/category/main-course" element={<MainCourse />} />
            <Route path="/category/desserts" element={<Desserts />} />
            <Route path="/category/beverages" element={<Beverages />} />
            <Route
              path="/category/veg-starters"
              element={<Starters category="veg" />}
            />
            <Route
              path="/category/non-veg-main-course"
              element={<MainCourse category="non-veg" />}
            />
            <Route
              path="/category/south-indian-meals"
              element={<SouthIndian meals={true} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
