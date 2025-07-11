import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { sampleRepo } from '../test_data/test_repos'
import avatar from "../assets/logo.png"
import { Link } from 'react-router-dom'
import { 
    Dialog,
    DialogPanel,
    DialogTitle,
    Description,
    DialogBackdrop,
} from '@headlessui/react'



const RepoPage = () => {
    const { id } = useParams()
    const repo = sampleRepo // samplerepo.id

    const [isEditingAbout, setIsEditingAbout] = useState(false)
    const [formSummary, setFormSummary] = useState(repo.summary)
    const [isEditingReadme, setIsEditingReadme] = useState(false)
    const [formReadme, setFormReadme] = useState(repo.readme)

    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newSummary, setNewSummary] = useState('')
    const [newDescription, setNewDescription] = useState('')

    // on save
    const handleAddCommit = () => {
        console.log({ summary: newSummary, description: newDescription })
        // TODO push to api and refresh
        setIsAddOpen(false)
        setNewSummary('')
        setNewDescription('')
    }

    return (
        <main className="font-mono min-h-screen bg-black text-white">
            {/* header repo title*/}
            <div className="py-4 px-6 flex items-center justify-between border-b-2 border-gray-800">
                <div className="flex items-center space-x-3">
                    <Link to={`/profile/${repo.user}`}>
                        <img
                            src={avatar}
                            alt={`${repo.user} avatar`}
                            className="h-8 w-8 rounded-full cursor-pointer duration-50 hover:border"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold">
                        <Link
                            to={`/profile/${repo.user}`}
                            className="hover:underline"
                        >
                            {repo.user}
                        </Link>
                        <span className="text-gray-500"> / </span>
                        {repo.name}
                    </h1>
                    <span className="ml-4 px-2 py-1 bg-gray-200 text-black font-semibold rounded text-md">
                        {repo.isPublic ? "Public" : "Private"}
                    </span>
                </div>
                <div className="space-x-4">
                    <button
                        className="px-3 py-1 bg-gray-500 text-black font-semibold rounded text-md duration-500 hover:bg-gray-300"
                        onClick={() => setIsAddOpen(true)}>
                        <i className="bi bi-plus-circle"></i>
                        &nbsp;
                        Add Commit
                    </button>
                    <Dialog
                        open={isAddOpen}
                        onClose={() => setIsAddOpen(false)}
                        className="relative z-50"
                        transition
                    >
                        <DialogBackdrop className="fixed inset-0 bg-black/80" transition/>

                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <DialogPanel 
                            className="bg-gray-800 text-white rounded-lg max-w-2/3 w-full p-6 space-y-4 border-2 border-gray-600 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                            transition
                            >
                                <DialogTitle className="text-lg font-bold">
                                    New Commit
                                </DialogTitle>
                                <Description className="text-sm text-gray-400">
                                    Add a summary and description to the commit below
                                </Description>

                                {/* sum */}
                                <div>
                                    <label className="block text-sm font-semibold text-white">
                                        Commit Summary
                                    </label>
                                    <input
                                        type="text"
                                        value={newSummary}
                                        onChange={e => setNewSummary(e.target.value)}
                                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:outline-none"
                                    />
                                </div>

                                {/* desc */}
                                <div>
                                    <label className="block text-sm font-semibold text-white">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={newDescription}
                                        onChange={e => setNewDescription(e.target.value)}
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
                    <button className="px-3 py-1 bg-gray-500 text-black font-semibold rounded text-md duration-500 hover:bg-gray-300">
                        {repo.isPinned ? (
                            <>
                                <i className="bi bi-pin-angle-fill" />
                                &nbsp;
                                <span>Unpin</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-pin-angle" />
                                &nbsp;
                                <span>Pin</span>
                            </>
                        )}
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-black font-semibold rounded text-md duration-500 hover:bg-yellow-300">
                        {repo.isStarred ? (
                            <>
                                <i className="bi bi-star-fill" />
                                &nbsp;
                                <span>Unstar</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-star" />
                                &nbsp;
                                <span>Star</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="mx-auto px-16 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* side */}
                <aside className="space-y-6">
                    {/* abt */}
                    <div>
                        <h2 className="font-semibold mb-2">About</h2>

                        {isEditingAbout ? (
                            <textarea
                                rows={3}
                                value={formSummary}
                                onChange={e => setFormSummary(e.target.value)}
                                className="w-11/12 mx-auto lg:mx-0 mt-4 text-gray-400 bg-transparent border border-gray-800 rounded px-2 py-1 focus:outline-none"
                            />
                        ) : (
                            <p className="text-gray-400">{repo.summary}</p>
                        )}
                    </div>

                    {/* date */}
                    <div>
                        <h2 className="font-semibold mb-2">Created</h2>
                        <p className="text-gray-400">
                            {format(new Date(repo.createdAt), 'PPP')}
                        </p>
                    </div>

                    {/* edit save cancel */}
                    <div>
                        {isEditingAbout ? (
                            <div className="flex flex-col gap-4">
                                <button
                                    className="w-11/12 bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                                    onClick={() => {
                                        // TODO call API
                                        setIsEditingAbout(false)
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    className="w-11/12 bg-gray-700 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-gray-600"
                                    onClick={() => {
                                        setFormSummary(repo.summary)
                                        setIsEditingAbout(false)
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className="w-11/12 bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700"
                                onClick={() => setIsEditingAbout(true)}
                            >
                                <i className="bi bi-gear-wide-connected" /> Edit About
                            </button>
                        )}
                    </div>
                </aside>

                {/* commits & readme */}
                <section className="md:col-span-3 space-y-8">
                    {/* commits */}
                    <div className="space-y-4">
                        {repo.commits.map(c => (
                            <Link key={c.id} to={`/commit/${c.id}`} className="block">
                                <div key={c.id} className="bg-gray-900 border-2 border-gray-700 rounded-lg p-4 duration-500 hover:border-white">
                                    <h3 className="font-medium text-lg">{c.summary}</h3>
                                    <div className="mt-2 text-sm text-gray-500 flex justify-between">
                                        <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm font-semibold">{repo.user} • {c.projectSeason}</span>
                                        <span>{format(new Date(c.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Read-Me */}
                    <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">Read Me</h2>

                            {isEditingReadme ? (
                                <div className="space-x-2">
                                    <button
                                        className="px-3 py-1 bg-blue-900 text-white rounded duration-500 hover:bg-blue-700"
                                        onClick={() => {
                                            // TODO: push formReadme to your API here
                                            console.log('Saving readme:', formReadme)
                                            setIsEditingReadme(false)
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                                        onClick={() => {
                                            setFormReadme(repo.readme)    // reset
                                            setIsEditingReadme(false)
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="text-gray-400 hover:text-white transition"
                                    onClick={() => setIsEditingReadme(true)}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                            )}
                        </div>

                        {isEditingReadme ? (
                            <textarea
                                rows={10}
                                value={formReadme}
                                onChange={e => setFormReadme(e.target.value)}
                                className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded p-3 focus:outline-none"
                            />
                        ) : (
                            <pre className="whitespace-pre-wrap text-gray-400">
                                {repo.readme}
                            </pre>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default RepoPage