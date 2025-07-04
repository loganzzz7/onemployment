import React from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { sampleRepo } from '../test_data/test_repos'
import avatar from "../assets/logo.png"


const RepoPage = () => {
    const { id } = useParams()
    const repo = sampleRepo // samplerepo.id

    return (
        <main className="min-h-screen bg-black text-white">
            {/* — Header with nav & repo title — */}
            <div className="py-4 px-6 flex items-center justify-between border-t-4 border-b-4 border-gray-900">
                <div className="flex items-center space-x-3">
                    <img src={avatar} alt="logo" className="h-8 w-8" />
                    <h1 className="text-2xl font-bold">/ {repo.name}</h1>
                    <span className="ml-4 px-2 py-1 bg-gray-200 text-black rounded text-md">
                        {repo.isPublic ? "Public" : "Private"}
                    </span>
                </div>
                <div className="space-x-4">
                    <button className="px-3 py-1 bg-gray-600 text-black rounded text-md duration-500 hover:bg-gray-300">
                        {repo.isPinned ? "Unpin" : "Pin"}
                    </button>
                    <button className="px-3 py-1 bg-yellow-600 text-black rounded text-md duration-500 hover:bg-yellow-300">
                        ⭐ {repo.stars}
                    </button>
                </div>
            </div>

            <div className="mx-auto px-16 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* — Sidebar — */}
                <aside className="space-y-6">
                    <div>
                        <h2 className="font-semibold mb-2">About</h2>
                        <p className="text-gray-400">{repo.summary}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-2">Created</h2>
                        <p className="text-gray-400">{format(new Date(repo.createdAt), 'PPP')}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-4">Settings</h2>
                        {/* stubbed settings links */}
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button className="bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700">
                                    Edit Repository
                                </button>
                            </li>
                            <li>
                                <button className="bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700">
                                    Delete Repository
                                </button>
                            </li>
                        </ul>
                    </div>
                </aside>

                {/* — Main content: commits & readme — */}
                <section className="md:col-span-3 space-y-8">
                    {/* Commits */}
                    <div className="space-y-4">
                        {repo.commits.map(c => (
                            <div key={c.id} className="bg-gray-900 border-2 border-gray-700 rounded-lg p-4">
                                <h3 className="font-medium text-lg">{c.summary}</h3>
                                <div className="mt-2 text-sm text-gray-500 flex justify-between">
                                    <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm font-semibold">{c.user} • {c.projectSeason}</span>
                                    <span>{format(new Date(c.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Read-Me */}
                    <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Read Me</h2>
                            <button className="text-gray-500 duration-500 hover:text-white">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-gray-400">
                            {repo.readme}
                        </pre>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default RepoPage