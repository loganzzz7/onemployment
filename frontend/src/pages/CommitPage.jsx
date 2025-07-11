import React from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { sampleCommit } from '../test_data/test_commit'

const CommitPage = () => {
    const { id } = useParams()
    const commit = sampleCommit //fetch commit id ltr

    return (
        <main className="min-h-screen bg-black p-4 border-t-4 border-gray-900 text-white">
            {/* — Header with avatar, repo link, and commit number — */}
            <div className="bg-gray-900 rounded-lg p-6 flex items-center justify-between">
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
                <div className="text-gray-600 text-sm">
                    {format(new Date(commit.createdAt), 'PPP p')}
                </div>
            </div>

            {/* — Like button — */}
            <div className="mt-4 flex justify-end items-center">
                <button className="flex items-center space-x-2 text-gray-600 duration-500 hover:text-red-600">
                    <span><i className="bi bi-heart-fill"></i></span>
                    <span className="font-medium">{commit.likes}</span>
                </button>
            </div>

            {/* — Separator — */}
            <hr className="my-4 rounded border-2 border-gray-800" />

            {/* — Description — */}
            <section className="bg-gray-900 shadow rounded-lg p-6 whitespace-pre-wrap">
                {commit.description}
            </section>

            {/* — Comments — */}
            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                    Comments ({commit.comments.length})
                </h2>
                {commit.comments.length === 0 ? (
                    <p className="text-gray-600">No comments yet.</p>
                ) : (
                    <div className="space-y-4">
                        {commit.comments.map(c => (
                            <div key={c.id} className="bg-gray-900 shadow rounded-lg p-4">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                    <span>@{c.author}</span>
                                    <span>{format(new Date(c.createdAt), 'MMM d, yyyy p')}</span>
                                </div>
                                <p className="text-sm">{c.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* — Sign-in to comment cta — */}
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