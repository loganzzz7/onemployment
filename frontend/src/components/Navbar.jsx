import React from 'react'
import logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <nav className="font-mono bg-black selection:bg-purple-800 border-b-2 border-gray-800">
      <div className="w-full py-4 px-8 flex items-center justify-between">
        <a href='/' className="flex items-center gap-2 space-x-2">
          <img src={logo} alt="onEmployment logo" className="h-8 w-8" />
          <div className="flex items-left flex-col">
            <span className="text-xl font-bold text-white">
              on
            </span>
            <span className="text-xl font-bold text-white">
              Employment
            </span>
          </div>

        </a>
        <a href="/connect" className="font-bold text-gray-400 duration-500 hover:text-white">
          <p>
            <i className="bi bi-person-add"></i> Connect
          </p>
        </a>
        <a
          href="/signup"
          className="bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
        >
          Lock-In
        </a>
      </div>
    </nav>
  )
}

export default Navbar