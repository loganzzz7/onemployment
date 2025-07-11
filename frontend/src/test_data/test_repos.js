export const sampleRepos = [
  {
    id: "1",
    name: "Gym",
    summary: "Logging meals and exercises every day.",
    user: "llc",
    projectSeason: "SU 2025",
    createdAt: "2025-06-15T14:30:00Z"
  },
  {
    id: "2",
    name: "C Study Plan",
    summary: "1 hour of C practice daily.",
    user: "scoobert",
    projectSeason: "SP 2025",
    createdAt: "2025-02-20T09:00:00Z"
  },
  {
    id: "3",
    name: "C++ Study Plan",
    summary: "1 hour of C++ practice daily.",
    user: "poobert",
    projectSeason: "SP 2025",
    createdAt: "2025-02-18T09:00:00Z"
  },
    {
    id: "4",
    name: "C# Study Plan",
    summary: "1 hour of C# practice daily.",
    user: "loobert",
    projectSeason: "W 2024",
    createdAt: "2024-12-18T09:00:00Z"
  },
]

export const sampleRepo = {
  id: "1",
  name: "Gym",
  user: "scoobert",
  summary: "Logging meals and exercises every day.",
  isPublic: true,
  isStarred: false,
  stars: 0,
  isPinned: false,
  createdAt: "2025-06-15T14:30:00Z",
  commits: [
    {
      id: "c1",
      summary: "Started new leg day routine",
      projectSeason: "SU 2025",
      createdAt: "2025-06-15T17:00:00Z"
    },
    {
      id: "c2",
      summary: "Added meal tracking form",
      projectSeason: "SU 2025",
      createdAt: "2025-06-16T08:30:00Z"
    },
    {
      id: "c3",
      summary: "Updated exercise log UI",
      projectSeason: "SU 2025",
      createdAt: "2025-06-17T19:45:00Z"
    },
  ],
  readme: `# Gym Repository

This repo helps me track my gym sessions and meal logs each day.

## How to use
- Commit every workout under “Commits”
- Fill out the meal form after each session
- Check your progress on the dashboard

Happy lifting! 💪
`
}