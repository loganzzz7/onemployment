import React from 'react'
import { format } from 'date-fns'

const RepoCard = ({ repo, className = "" }) => {
    return (
        <div className={
            `bg-gray-900 rounded-lg border-2 border-gray-600 rounded-lg p-6 flex flex-col md:flex-row justify-between
         ${className}`
        }>
            {/* name, summary, tags */}
            <div>
                <h3 className="text-xl font-semibold text-white">{repo.name}</h3>
                <p className="mt-2 text-gray-300">{repo.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm">
                        {repo.user}
                    </span>
                    <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm">
                        {repo.projectSeason}
                    </span>
                </div>
            </div>

            {/* upload date */}
            <div className="mt-4 md:mt-0 text-gray-300 text-sm flex-shrink-0">
                {format(new Date(repo.createdAt), 'MMM d, yyyy')}
            </div>
        </div>
    )
}

export default RepoCard