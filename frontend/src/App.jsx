import { Box, Button, HStack } from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import ConnectPage from "./pages/ConnectPage"
import Navbar from "./components/Navbar"

function App() {

  return (
    <Box minH={"100vh"}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect" element={<ConnectPage />} />

      </Routes>
    </Box>
  )
}

export default App
