import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home/Home";
import MenuPage from "./pages/MenuPage/MenuPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Contact from "./pages/Contact/Contact";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import OffersPage from "./pages/OffersPage/OffersPage";
import ProfilePage from "./pages/Auth/ProfilePage";
import Vegetarian from "./pages/CategoryPages/Vegetarian/Vegetarian";
import NonVegetarian from "./pages/CategoryPages/NonVegetarian/NonVegetarian";
import SouthIndian from "./pages/CategoryPages/SouthIndian/SouthIndian";
import Starters from "./pages/CategoryPages/Starters/Starters";
import MainCourse from "./pages/CategoryPages/MainCourse/MainCourse";
import Desserts from "./pages/CategoryPages/Desserts/Desserts";
import Beverages from "./pages/CategoryPages/Beverages/Beverages";

// Admin
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./admin/context/AdminContext";
import AdminRoutes from "./admin/pages/AdminRoutes";

// Public Layout Wrapper
const PublicLayout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <Router>
          <ScrollToTop /> {/* Scrolls to top on route change */}
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/menu" element={<PublicLayout><MenuPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/offers" element={<PublicLayout><OffersPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/profile" element={<PublicLayout><ProfilePage /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><ProfilePage /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
            <Route path="/order-confirmation/:orderId" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />

            <Route path="/category/veg" element={<PublicLayout><Vegetarian /></PublicLayout>} />
            <Route path="/category/non-veg" element={<PublicLayout><NonVegetarian /></PublicLayout>} />
            <Route path="/category/south-indian" element={<PublicLayout><SouthIndian /></PublicLayout>} />
            <Route path="/category/starters" element={<PublicLayout><Starters /></PublicLayout>} />
            <Route path="/category/main-course" element={<PublicLayout><MainCourse /></PublicLayout>} />
            <Route path="/category/desserts" element={<PublicLayout><Desserts /></PublicLayout>} />
            <Route path="/category/beverages" element={<PublicLayout><Beverages /></PublicLayout>} />
            <Route path="/category/veg-starters" element={<PublicLayout><Starters category="veg" /></PublicLayout>} />
            <Route path="/category/non-veg-main-course" element={<PublicLayout><MainCourse category="non-veg" /></PublicLayout>} />
            <Route path="/category/south-indian-meals" element={<PublicLayout><SouthIndian meals={true} /></PublicLayout>} />

            {/* Admin Pages */}
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
