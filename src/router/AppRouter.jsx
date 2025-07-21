import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Home from "../Pages/Home";
import Cat from "../Pages/Cat";
import Profile from "../Pages/Profile";
import EditProfile from "../Pages/EditProfile";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import ForgetPassword from "../Pages/ForgetPass";
import ResetPassword from "../Pages/Reset";
import Cards from "../Pages/Cards";
import Sentences from "../Pages/Sentence";
import User from "../Pages/User";

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cat" element={<Cat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgetPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/sent" element={<Sentences />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
