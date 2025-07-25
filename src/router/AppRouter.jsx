import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Home from "../pages/Home";
import Categories from "../pages/Categories";
import Login from "../pages/Login";
import Cards from "../pages/Cards";
import User from "../pages/User";
import DefaultCards from "../pages/DefultCard";

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/user" element={<User />} />
          <Route path="/default" element={<DefaultCards />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          {/* <Route path="/edit" element={<EditProfile />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route path="/forgot" element={<ForgetPassword />} /> */}
          {/* <Route path="/reset" element={<ResetPassword />} /> */}
          {/* <Route path="/sent" element={<Sentences />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
