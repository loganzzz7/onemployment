import React, { useState, useEffect } from 'react'
import { sampleRepos } from "../test_data/test_repos"
import RepoCard from '../components/RepoCard'
import { Link } from 'react-router-dom'

const ConnectPage = () => {
  const [visibleCount, setVisibleCount] = useState(3)
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // search for friend => reset to 3
  useEffect(() => {
    if (searchActive) {
      setVisibleCount(3)
    }
  }, [searchActive, searchQuery])

  const allRepos = searchActive
    ? sampleRepos.filter(r =>
      r.user.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
    : sampleRepos

  const handleViewMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, allRepos.length))
  }

  const visibleRepos = allRepos.slice(0, visibleCount)

  return (
    <main className="font-mono selection::bg-purple-800 bg-black min-h-screen">
      <section className="w-11/12 mx-auto pt-16 flex justify-between">
        <div className="text-white flex flex-col gap-4">
          <p className="sm:text-md md:text-xl lg:text-4xl font-bold">Progress Together</p>
          <p className="sm:text-sm md:text-md lg:text-lg font-bold">Discover how others are locking in and improve together</p>
        </div>

        <div className="flex items-center space-x-2 font-bold text-gray-400">
          {!searchActive ? (
            <button
              onClick={() => setSearchActive(true)}
              className="duration-500 hover:text-white flex items-center space-x-1"
            >
              <i className="bi bi-search" />
              <span>Search for a friend</span>
            </button>
          ) : (
            <>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter username..."
                className="bg-transparent border-b border-gray-400 text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  setSearchActive(false)
                  setSearchQuery('')
                }}
                className="text-gray-500 duration-500 hover:text-white"
              >
                <i className="bi bi-x-square"></i>
              </button>
            </>
          )}
        </div>
      </section>
      <section className="w-11/12 mx-auto pt-12">
        <div className="text-white font-medium pb-4">
          <p>Repositories:</p>
        </div>
        <div className="border-2 border-gray-400 rounded overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col gap-8 p-4">
            {visibleRepos.map(r => (
              <Link key={r.id} to={`/repo/${r.id}`} className="block">
                <RepoCard repo={r} className="duration-500 hover:border-white" />
              </Link>
            ))}
          </div>

          {/* no button if no more repos */}
          {visibleCount < allRepos.length && (
            <button
              onClick={handleViewMore}
              className="block mx-auto my-4 mb-8 px-6 py-2 bg-blue-900 text-white rounded"
            >
              View More
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

export default ConnectPage