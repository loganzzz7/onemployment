import avatar from "../assets/logo.png"

export const sampleCommit = {
  id: "c10",
  repoId: "r1",
  number: 10,
  summary: "Added skeleton for commit page",
  description: `Today I built the commit page:

- Created <CommitPage /> 
- Hooked it up to /api/entries POST endpoint  

Next up: form validation and tests.
`,
  user: {
    username: "scoobert",
    avatarUrl: {avatar}  
  },
  projectSeason: "Spring 2025",
  createdAt: "2025-06-20T14:30:00Z",
  likes: 100,
  comments: [
    {
      id: "cm1",
      author: "poobert",
      text: "Looks great!",
      createdAt: "2025-06-20T15:00:00Z"
    },
    {
      id: "cm2",
      author: "boobert",
      text: "Poggers!",
      createdAt: "2025-06-20T16:45:00Z"
    }
  ]
}