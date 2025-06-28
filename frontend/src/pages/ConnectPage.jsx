import React from 'react'
import { sampleRepos } from "../test_data/test_repos"
import RepoCard from '../components/RepoCard'

const ConnectPage = () => {
  return (
    <main className="font-mono selection::bg-purple-800 bg-black min-h-screen">
      <section className="w-11/12 mx-auto pt-16 flex justify-between">
        <div className="text-white flex flex-col gap-4">
          <p className="sm:text-md md:text-xl lg:text-4xl font-bold">Progress Together</p>
          <p className="sm:text-sm md:text-md lg:text-lg font-bold">Discover how others are locking in and improve together</p>
        </div>
        <div className="flex font-bold text-gray-400">
          <p className="duration-500 hover:text-white"><i className="bi bi-search"></i> Search for a friend</p>
        </div>
      </section>
      <section className="w-11/12 mx-auto pt-12">
        <div className="text-white font-medium pb-4">
          <p>Repositories:</p>
        </div>
        <div className="border-2 border-gray-400 rounded overflow-y-auto max-h-[60vh]">
          <div className="flex flex-col gap-8 p-4">
            {sampleRepos.map(repo => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
          <button className="block mx-auto my-4 mb-8 px-6 py-2 bg-blue-900 text-white rounded">
            View More
          </button>
        </div>
      </section>
    </main>
  )
}

export default ConnectPage