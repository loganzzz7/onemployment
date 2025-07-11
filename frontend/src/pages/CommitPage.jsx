import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { sampleCommit } from '../test_data/test_commit'

const CommitPage = () => {
    const { id } = useParams()
    const commit = sampleCommit //fetch commit id ltr

    const [isEditingDesc, setIsEditingDesc] = useState(false)
    const [formDesc, setFormDesc] = useState(commit.description)

    return (
        <main className="font-mono min-h-screen bg-black py-8 text-white px-16 flex flex-col gap-8">
            {/* — header — */}
            <div className="bg-gray-900 rounded-lg p-6 flex items-center justify-between border-2 border-gray-700">
                <div className="flex items-center space-x-4">
                    <img
                        src={commit.user.avatarUrl}
                        alt={`${commit.user.username} avatar`}
                        className="w-12 h-12 rounded-full object-cover border border-gray-600"
                    />
                    <div>
                        <p className="text-gray-600">@{commit.user.username}</p>
                        <h1 className="text-2xl font-bold">Commit #{commit.number}</h1>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-gray-600 text-sm">
                        {format(new Date(commit.createdAt), 'PPP p')}
                    </div>
                    <button className="flex items-center space-x-1 text-gray-600 duration-500 hover:text-red-600">
                        <span><i className="bi bi-heart-fill"></i></span>
                        <span className="text-sm">{commit.likes}</span>
                    </button>
                </div>
            </div>

            {/* — Description Section — */}
            <section className="bg-gray-900 shadow rounded-lg p-6 border-2 border-gray-700">
                {/* header with title + edit controls */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Description:</h2>

                    {isEditingDesc ? (
                        <div className="space-x-2">
                            <button
                                className="px-3 py-1 bg-blue-900 text-white rounded duration-500 hover:bg-blue-700"
                                onClick={() => {
                                    // TODO: send formDesc to your API
                                    console.log('Saving description:', formDesc)
                                    setIsEditingDesc(false)
                                }}
                            >
                                Save
                            </button>
                            <button
                                className="px-3 py-1 bg-gray-700 text-white rounded duration-500 hover:bg-gray-600"
                                onClick={() => {
                                    setFormDesc(commit.description)  // discard changes
                                    setIsEditingDesc(false)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="text-gray-400 hover:text-white transition"
                            onClick={() => setIsEditingDesc(true)}
                        >
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    )}
                </div>

                {isEditingDesc ? (
                    <textarea
                        rows={8}
                        value={formDesc}
                        onChange={e => setFormDesc(e.target.value)}
                        className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded p-3 focus:outline-none resize-vertical"
                    />
                ) : (
                    <pre className="whitespace-pre-wrap text-gray-400">
                        {commit.description}
                    </pre>
                )}
            </section>

            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                    Comments ({commit.comments.length})
                </h2>
                {commit.comments.length === 0 ? (
                    <p className="text-gray-600">No comments yet.</p>
                ) : (
                    <div className="space-y-4">
                        {commit.comments.map(c => (
                            <div key={c.id} className="bg-gray-900 shadow rounded-lg p-4 border-2 border-gray-700">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                    <span>@{c.author}</span>
                                    <span>{format(new Date(c.createdAt), 'MMM d, yyyy p')}</span>
                                </div>
                                <p className="text-sm">{c.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Sign in to comment
                    </button>
                </div>
            </section>
        </main>
    )
}

export default CommitPage