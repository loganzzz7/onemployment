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
import ProfileRepoPage from "./pages/ProfileRepoPage"
import SettingsPage from "./pages/SettingsPage"


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
        <Route path="/profile/:username/repos" element={<ProfileRepoPage />} />
        <Route path="/profile/:username/repos/:repoid" element={<RepoPage />} />
        <Route path="/profile/:username/repos/:repoid/commits/:commitid" element={<CommitPage />} />
        <Route path="/settings/:username/:tab" element={<SettingsPage />} />



      </Routes>
      <Footer />
    </>
  )
}

export default App
