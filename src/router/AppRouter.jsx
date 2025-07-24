import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Home from "../pages/Home";
import Categories from "../pages/Categories";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgetPassword from "../pages/ForgetPass";
import ResetPassword from "../pages/Reset";
import Cards from "../pages/Cards";
import Sentences from "../pages/Sentence";
import User from "../pages/User";

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route path="/forgot" element={<ForgetPassword />} /> */}
          {/* <Route path="/reset" element={<ResetPassword />} /> */}
          <Route path="/cards" element={<Cards />} />
          {/* <Route path="/sent" element={<Sentences />} /> */}
          <Route path="/user" element={<User />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
