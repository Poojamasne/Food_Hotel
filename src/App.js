import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Website Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProfilePage from "./pages/Auth/ProfilePage";

import Home from "./pages/Home/Home";
import MenuPage from "./pages/MenuPage/MenuPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Contact from "./pages/Contact/Contact";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import OffersPage from "./pages/OffersPage/OffersPage";
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

// Public Layout Component
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
          <div className="App">
            <Routes>
              {/* Public Website Routes */}
              <Route
                path="/*"
                element={
                  <PublicLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/offers" element={<OffersPage />} />
                      <Route path="/contact" element={<Contact />} />
                      

                      {/* Auth/Profile Page */}
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/login" element={<ProfilePage />} />

                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />

                      <Route
                        path="/order-confirmation/:orderId"
                        element={<OrderConfirmation />}
                      />

                      <Route path="/category/veg" element={<Vegetarian />} />
                      <Route
                        path="/category/non-veg"
                        element={<NonVegetarian />}
                      />
                      <Route
                        path="/category/south-indian"
                        element={<SouthIndian />}
                      />
                      <Route path="/category/starters" element={<Starters />} />
                      <Route
                        path="/category/main-course"
                        element={<MainCourse />}
                      />
                      <Route path="/category/desserts" element={<Desserts />} />
                      <Route
                        path="/category/beverages"
                        element={<Beverages />}
                      />
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
                  </PublicLayout>
                }
              />

              {/* Admin Panel Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
