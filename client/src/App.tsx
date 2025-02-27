import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Signup from "./pages/Signup.tsx";
import Signin from "./pages/Signin.tsx";
import Blog from "./pages/Blog.tsx";
import Blogs from "./pages/Blogs.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/blogs' element={<Blogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
