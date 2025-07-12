import { Route, Routes } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import ConnectPage from "./pages/ConnectPage"
import SignupPage from "./pages/SignupPage"
import SigninPage from "./pages/SigninPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProfilePage from './pages/ProfilePage'
import RepoPage from "./pages/RepoPage"
import CommitPage from './pages/CommitPage'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/repo/:id" element={<RepoPage/>} />
        <Route path="/commit/:id" element={<CommitPage/>} />

      </Routes>
      <Footer />
    </>
  )
}

export default App
