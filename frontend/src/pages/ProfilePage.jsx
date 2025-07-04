import React from 'react'
import { format, subDays } from 'date-fns'
import { currentUser } from '../test_data/test_user'
import RepoCard from '../components/RepoCard'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'



const ProfilePage = () => {
    const endDate = new Date()
    const startDate = subDays(endDate, 364)

    const icons = {
        twitter: "bi bi-twitter-x",
        linkedin: "bi bi-linkedin",
        github: "bi bi-github",
    }

    const baseUrls = {
        twitter: 'https://x.com/',
        linkedin: 'https://linkedin.com/in/',
        github: 'https://github.com/',
    };


    return (
        <main className="bg-black min-h-screen">
            <section className="py-8 text-white border-t-2 border-gray-800">
                <div className="px-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* — left — */}
                    <div className="space-y-4 text-center lg:text-left">
                        <img
                            src={currentUser.avatarUrl}
                            alt={`${currentUser.name} avatar`}
                            className="mx-auto lg:mx-0 h-48 w-48 rounded-full border-2 border-gray-800"
                        />
                        <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                        <p className="text-gray-300">@{currentUser.username}</p>
                        <p className="mt-4 text-gray-400">{currentUser.bio}</p>
                        <button className="bg-blue-900 text-white font-bold px-4 py-2 rounded duration-500 hover:bg-blue-700">
                            Edit Profile
                        </button>

                        <ul className="space-y-2 text-gray-400">
                            <li>👥 {currentUser.followers} followers</li>
                            <li>👀 {currentUser.following} following</li>
                            <li>🏢 {currentUser.company}</li>
                            <li>📍 {currentUser.location}</li>
                            <li>🗓 Joined {format(new Date(currentUser.joinedAt), 'MMM yyyy')}</li>
                            <li>🔗 <a href={currentUser.website} className="text-blue-700 hover:underline hover:text-blue-500">{currentUser.website}</a></li>
                        </ul>

                        <div className="text-blue-700 mt-8 space-x-4">
                            {Object.entries(currentUser.socials).map(([key, handle]) =>
                                handle && icons[key] ? (
                                    <a
                                        key={key}
                                        href={`${baseUrls[key]}${handle}`}
                                        className="duration-500 hover:text-white"
                                        target="_blank"
                                    >
                                        <i className={icons[key]} />
                                    </a>
                                ) : null
                            )}
                        </div>
                    </div>

                    {/* right */}
                    <div className="md:col-span-2 space-y-8">
                        {/* pinned repos */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Pinned Repositories</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentUser.pinnedRepos.map(r => (
                                    <RepoCard key={r.id} repo={r} />
                                ))}
                            </div>
                        </div>

                        {/* commit graph placeholder */}
                        <section className="mb- 8 p-4 bg-gray-900 rounded-lg shadow border-2 border-gray-600">
                            <h2 className="text-xl font-semibold mb-4">
                                Contributions in the last year
                            </h2>
                            <CalendarHeatmap
                                startDate={startDate}
                                endDate={endDate}
                                values={currentUser.contributionData}
                                gutterSize={3}      //px btwn cells
                                transformDayElement={(rect, value, idx) =>      //border radius
                                    React.cloneElement(rect, {
                                        rx: 2.5,
                                        ry: 2.5,
                                    })
                                }
                                classForValue={value => {
                                    if (!value || value.count === 0) return 'color-empty'
                                    if (value.count < 2) return 'color-scale-1'
                                    if (value.count < 4) return 'color-scale-2'
                                    if (value.count < 8) return 'color-scale-3'
                                    return 'color-scale-4'
                                }}
                                // tooltipDataAttrs={value => ({
                                //     'data-tip': value
                                //         ? `${value.date}: ${value.count} commit${value.count !== 1 ? 's' : ''}`
                                //         : 'No commits',
                                // })}
                                showWeekdayLabels
                            />
                            {/* add ReactTooltip or similar to show tooltips */}
                        </section>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ProfilePage