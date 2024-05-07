import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

//import LogIn from "./components/Login";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import PostList from "./components/PostList";



function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register"element={<SignUp/>}></Route>
        <Route path="/postlist"element={<PostList/>}></Route>
        {/* /Routes><Route path="/" element={</>}></Route> */}
      </Routes>
    </>
  );
}

export default App;
