import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  DialogBackdrop,
} from '@headlessui/react'

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    fetch('/api/auth/me', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
      })
      .then(data => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null))
  }, [])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [newReadme, setNewReadme] = useState('')

  // on save
  const handleAddCommit = () => {
    console.log({ name: newName, summary: newSummary, readme: newReadme })
    // TODO push to api and refresh
    setIsAddOpen(false)
    setNewName('')
    setNewSummary('')
    setNewReadme('')
  }

  return (
    <nav className="font-mono bg-black selection:bg-purple-800 border-b-2 border-gray-800">
      <div className="w-full py-4 px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="onEmployment logo" className="h-8 w-8" />
          <div className="flex flex-col text-white leading-tight">
            <span className="text-xl font-bold">on</span>
            <span className="text-xl font-bold">Employment</span>
          </div>
        </Link>

        <Link
          to="/connect"
          className="font-bold text-gray-400 duration-500 hover:text-white"
        >
          <i className="bi bi-person-add" /> Connect
        </Link>

        {/* Lock-In or Profile */}
        {currentUser ? (
          <div className="flex gap-8">
            <button
              className="px-4 bg-gray-800 text-white font-semibold rounded text-md duration-500 hover:bg-gray-300 hover:text-black"
              onClick={() => setIsAddOpen(true)}>
              <i className="bi bi-plus-square"></i>
              &nbsp;
              New Commit
            </button>
            <Dialog
              open={isAddOpen}
              onClose={() => setIsAddOpen(false)}
              className="relative z-50 font-mono"
              transition
            >
              <DialogBackdrop className="fixed inset-0 bg-black/80" transition />

              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                  className="bg-gray-800 text-white rounded-lg max-w-2/3 w-full p-6 space-y-4 border-2 border-gray-600 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                  transition
                >
                  <DialogTitle className="text-lg font-bold">
                    New Repository
                  </DialogTitle>
                  <Description className="text-sm text-gray-400">
                    Add a name, summary and readme to the repository below
                  </Description>

                  {/* name */}
                  <div>
                    <label className="block text-sm font-semibold text-white">
                      Repository Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none"
                    />
                  </div>

                  {/* sum */}
                  <div>
                    <label className="block text-sm font-semibold text-white">
                      Resposity Summary
                    </label>
                    <textarea
                      type="text"
                      value={newSummary}
                      onChange={e => setNewSummary(e.target.value)}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none"
                    />
                  </div>

                  {/* desc */}
                  <div>
                    <label className="block text-sm font-semibold text-white">
                      ReadMe
                    </label>
                    <textarea
                      rows={4}
                      value={newReadme}
                      onChange={e => setNewReadme(e.target.value)}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none resize-vertical"
                    />
                  </div>

                  {/* cancel save */}
                  <div className="flex justify-end space-x-2 pt-2 font-semibold">
                    <button
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded duration-500 hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCommit}
                      className="px-4 py-2 bg-blue-900 text-white rounded duration-500 hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>
            <Link to={`/profile/${currentUser.username}`} className="flex gap-4 items-center font-semibold">
              <p className="text-white hover:underline">{currentUser.username}</p>
              <img
                src={currentUser.avatarUrl || logo}
                alt={`${currentUser.username} avatar`}
                className="h-12 w-12 rounded-full border-2 border-gray-600 cursor-pointer duration-500 hover:border-white"
              />
            </Link>
          </div>
        ) : (
          <Link
            to="/signup"
            className="bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
          >
            Lock-In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar