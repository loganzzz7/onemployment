import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  DialogBackdrop,
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel
} from '@headlessui/react'
import clsx from "clsx"
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import { AuthContext } from '../contexts/AuthContext'
const API = import.meta.env.VITE_API_BASE;



const Navbar = () => {
  const { user: currentUser, loading } = useContext(AuthContext)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [newReadme, setNewReadme] = useState('')

  // seasons list
  const seasons = [
    { id: 1, code: 'SP' },
    { id: 2, code: 'SU' },
    { id: 3, code: 'FL' },
    { id: 4, code: 'W' },
  ]

  // combobox state
  const [selectedSeason, setSelectedSeason] = useState(seasons[0])
  const [seasonQuery, setSeasonQuery] = useState('')

  const filteredSeasons =
    seasonQuery === ''
      ? seasons
      : seasons.filter(s =>
        s.code
          .toLowerCase()
          .includes(seasonQuery.trim().toLowerCase())
      )


  async function handleAddRepo() {
    const token = localStorage.getItem('token')
    if (!token) return alert('Please log in first')

    const payload = {
      name: newName,
      summary: newSummary,
      season: selectedSeason.code,
      readme: newReadme
    }

    try {
      const res = await fetch(`${API}/repos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create repo')

      // success
      console.log('Created repo:', data)
      setIsAddOpen(false)
      setNewName('')
      setNewSummary('')
      setNewReadme('')
      setSelectedSeason(seasons[0])
      setSeasonQuery('')
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  if (loading) return null

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
              New Repository
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
                  <div className="flex justify-between">
                    <Description className="text-sm text-gray-400">
                      Add a name, summary and readme to the repository below
                    </Description>
                    <div>
                      <label className=" text-sm font-semibold text-white">
                        Season:
                      </label>

                      <Combobox
                        value={selectedSeason}
                        onChange={setSelectedSeason}
                        onClose={() => setSeasonQuery('')}
                      >
                        <div className="relative mt-1 w-fit">
                          <ComboboxInput
                            className={clsx(
                              'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm text-white',
                              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                            )}
                            displayValue={s => s?.code || ''}
                            onChange={e => setSeasonQuery(e.target.value)}
                            placeholder="Select season"
                          />

                          <ComboboxButton className="group absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon className="h-4 w-4 fill-white/60 group-data-hover:fill-white" />
                          </ComboboxButton>

                          <ComboboxOptions
                            className={clsx(
                              'absolute z-50 mt-1',
                              'max-h-48 overflow-auto w-full',
                              'bg-gray-700 border border-gray-600 rounded-lg py-1 text-white',
                              'transition duration-300 ease-in data-leave:data-closed:opacity-0',
                              'empty:invisible'
                            )}
                          >
                            {filteredSeasons.map(season => (
                              <ComboboxOption
                                key={season.id}
                                value={season}
                                className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                              >
                                <CheckIcon className="h-4 w-4 invisible fill-white group-data-selected:visible" />
                                <span>{season.code}</span>
                              </ComboboxOption>
                            ))}
                          </ComboboxOptions>
                        </div>
                      </Combobox>
                    </div>

                  </div>

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

                  <div>
                    <label className="block text-sm font-semibold text-white">
                      Resposity Summary
                    </label>
                    <textarea
                      value={newSummary}
                      onChange={e => setNewSummary(e.target.value)}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none"
                    />
                  </div>

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

                  <div className="flex justify-end space-x-2 pt-2 font-semibold">
                    <button
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded duration-500 hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddRepo}
                      className="px-4 py-2 bg-blue-900 rounded duration-500 hover:bg-blue-700"
                    >
                      Create
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>
            {/* Popover around the avatar & username */}
            <Link to={`/profile/${currentUser.username}`} className="self-center">
              <p className="text-white hover:underline font-semibold">
                {currentUser.username}
              </p>
            </Link>
            <Popover className="relative">
              <PopoverButton className="flex gap-4 items-center focus:outline-none">
                <img
                  src={currentUser.avatarUrl || logo}
                  alt={`${currentUser.username} avatar`}
                  className="h-12 w-12 rounded-full border-2 border-gray-600 cursor-pointer duration-500 hover:border-white"
                />
              </PopoverButton>

              <PopoverPanel transition
                className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded z-10
                transition duration-300 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0">
                <ul className="flex flex-col p-2 space-y-1">
                  {/* profile link */}
                  <li>
                    <PopoverButton
                      as={Link}
                      to={`/profile/${currentUser.username}`}
                      className="flex gap-2 items-center px-3 py-2 text-white duration-500 hover:bg-gray-700 rounded"
                    >
                      <i className="bi bi-person-circle" />
                      <span>My Profile</span>
                    </PopoverButton>
                  </li>
                  {/* settings link */}
                  <li>
                    <PopoverButton
                      as={Link}
                      to={`/settings/${currentUser.username}/publicprofile`}
                      className="flex gap-2 items-center px-3 py-2 text-white duration-500 hover:bg-gray-700 rounded"
                    >
                      <i className="bi bi-gear-fill" />
                      <span>Settings</span>
                    </PopoverButton>
                  </li>
                </ul>
              </PopoverPanel>
            </Popover>
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