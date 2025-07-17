import React from 'react'
import { format } from 'date-fns'

const RepoCard = ({ repo, className = "" }) => {
  const owner =
    typeof repo.user === 'object'
      ? repo.user.username
      : String(repo.user)

  // season + year
  const year = new Date(repo.createdAt).getFullYear()
  const projectSeason = `${repo.season} • ${year}`

  return (
    <div
      className={
        `flex flex-col h-full border-2 border-gray-700 duration-500 hover:border-white rounded-lg overflow-hidden ` +
        className
      }
    >
      {/* content grows to fill */}
      <div className="p-4 flex-grow">
        <div className="flex justify-between flex-wrap">
          <h3 className="text-lg font-bold mb-2 text-white">{repo.name}</h3>
          <span className="text-sm">{format(new Date(repo.createdAt), 'MMM d, yyyy')}</span>
        </div>
        <p className="text-gray-400 text-sm mb-4 truncate">
          {repo.summary}
        </p>
      </div>

      {/* footer */}
      <div className="px-4 py-2 bg-gray-800 flex items-center flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm">
            {owner}
          </span>
          <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm">
            {projectSeason}
          </span>
        </div>
        <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-semibold">
          <i className="bi bi-star-fill" />&nbsp;{Array.isArray(repo.stars) ? repo.stars.length : 0}
        </span>
      </div>
    </div>
  )
}

export default RepoCard