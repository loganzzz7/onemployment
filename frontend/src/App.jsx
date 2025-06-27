import { Route, Routes } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import ConnectPage from "./pages/ConnectPage"
import SignupPage from "./pages/SignupPage"
import Navbar from "./components/Navbar"

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/signup" element={<SignupPage />} />


      </Routes>
    </>
  )
}

export default App
