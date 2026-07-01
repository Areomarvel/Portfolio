/**
 * Centralized data source for the Windows 11 Portfolio.
 * Feel free to modify this file to update the portfolio contents.
 */
const portfolioData = {
  profile: {
    name: "Areo Marvellous",
    title: "Full Stack Developer",
    subTitle: "Specializing in high-performance web applications & interactive user experiences",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex", // Fallback avatar SVG
    location: "San Francisco, CA (Open to Remote)",
    email: "areomarvel06@gmail.com",
    resumeUrl: "#", // Mock resume download link
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      mail: "mailto:areomarvel06@gmail.com"
    },
    bio: "I'm a software engineer passionate about building sleek, responsive, and accessible digital products. With over 4 years of experience, I merge technical proficiency with design sensitivity to write clean code and build memorable user interfaces."
  },

  projects: [
    {
      id: "Cowry-Wise-Project",
      title: "CowryWise Project",
      category: "web3",
      tags: ["HTML", "CSS", "Javascript"],
      summary: "AI-driven collaborative productivity suite with real-time syncing.",
      description: "CowryWise is an advanced task management application designed for agile teams. It integrates a conversational AI assistant that helps breakdown tasks, auto-schedules items based on team velocity, and features real-time collaborative whiteboards and kanban boards.",
      features: [
        "Real-time state synchronization using WebSockets.",
        "Natural Language Processing for auto-generating sub-tasks.",
        "Interactive dashboard with visual performance analytics.",
        "Custom workspace permissions and notification settings."
      ],
      github: "https://github.com/Areomarvel/project-level1",
      demo: "https://areomarvel.github.io/project-level1/"
    },
    {
      id: "Dramakey-Project",
      title: "Dramakey Project",
      category: "Entertainment",
      tags: ["HTML", "CSS"],
      summary: "DramaKey Clone is a responsive entertainment website inspired by the DramaKey platform, built to showcase Asian drama content including Korean, Chinese, and Thai series. The project features categorized content browsing, search functionality, dynamic drama listings, episode tracking, and a mobile-friendly user interface designed for seamless content discovery and engagement.",
      description: "DramaKey Clone is a responsive entertainment website inspired by the DramaKey platform, built to showcase Asian drama content including Korean, Chinese, and Thai series. The project features categorized content browsing, search functionality, dynamic drama listings, episode tracking, and a mobile-friendly user interface designed for seamless content discovery and engagement.",
      features: [
        "Browse and discover Asian dramas with detailed information including titles, genres, episode counts, and release years.",
        "Responsive, mobile-first design that adapts seamlessly to different screen sizes and devices.",
        "Category filtering system for easy navigation through Korean, Chinese, Thai, and other Asian dramas.",
        "Search functionality to quickly find specific dramas by title.",
        "Dynamic content display with real-time updates and interactive elements.",
        "Clean, modern user interface with smooth animations and intuitive navigation.",
        "Smooth scrolling and transition effects for a premium user experience.",
        "Cross-browser compatibility for consistent viewing across different browsers."
      ],
      github: "https://github.com/Areomarvel/dramakey-clone",
      demo: "https://areomarvel.github.io/dramakey-clone/"
    },
    {
      id: "Calculator",
      title: " Calculator",
      category: "Developer Tools",
      tags: ["HTML", "CSS", "JavaScript"  ],
      summary: "Marvellous Calculator is a responsive web calculator inspired by the iPhone Calculator design. It supports essential arithmetic operations, percentage calculations, decimal inputs, and positive/negative value toggling through a clean and intuitive user interface. The project demonstrates front-end development skills in creating interactive, responsive, and user-friendly web applications using modern web technologies.",
      description: "Marvellous Calculator is a responsive web calculator inspired by the iPhone Calculator design. It supports essential arithmetic operations, percentage calculations, decimal inputs, and positive/negative value toggling through a clean and intuitive user interface. The project demonstrates front-end development skills in creating interactive, responsive, and user-friendly web applications using modern web technologies.",
      features: [
        " Support for basic arithmetic operations including addition, subtraction, multiplication, and division.",
        "Toggle functionality to switch between positive and negative values.",
        "Responsive, mobile-first design that adapts seamlessly to different screen sizes and devices.",
        "Clean, modern user interface with smooth animations and intuitive navigation."
      ],
      github: "https://github.com/Areomarvel/Calculator",
      demo: "https://marvellous-calculator.vercel.app/"
    },
    {
      id: "gitflow-viz",
      title: "GitFlow Visualizer",
      category: "developer-tools",
      tags: ["Vue.js", "D3.js", "Git API", "TailwindCSS"],
      summary: "Interactive git commit tree and branch visualizer for repositories.",
      description: "GitFlow Visualizer connects to GitHub repositories via OAuth and transforms commit histories into highly interactive D3.js trees. It helps team leads audit branch mergers, trace cherry-picked commits, and visually map release histories.",
      features: [
        "Custom D3-force rendering for highly complex merge histories.",
        "Branch filtering and commit searching with search-as-you-type.",
        "OAuth2 integration for private repository analysis.",
        "Interactive timeline scroll with animated branch creation nodes."
      ],
      github: "https://github.com",
      demo: "https://github.com"
    },
    {
      id: "cloudpulse",
      title: "CloudPulse Monitor",
      category: "systems",
      tags: ["Go", "React", "gRPC", "Docker", "Prometheus"],
      summary: "Real-time microservices monitor dashboard with automated alerts.",
      description: "CloudPulse tracks host metrics, database queries, and gRPC traffic for distributed Docker services. It features a dashboard that displays memory leaks, network traffic congestions, and sends immediate webhook warnings on container crashes.",
      features: [
        "Lightweight Go daemon monitoring metrics with ultra-low overhead.",
        "Responsive canvas-based charts displaying active container CPU and RAM.",
        "Custom rule engine to trigger Discord and Slack webhooks.",
        "Docker daemon API connection mapping service topologies dynamically."
      ],
      github: "https://github.com",
      demo: "https://github.com"
    }
  ],

  skills: {
    frontend: [
      { name: "React / Next.js", level: 92, xp: 4, icon: "bi-react" },
      { name: "HTML5 / CSS3 / Sass", level: 95, xp: 5, icon: "bi-filetype-css" },
      { name: "JavaScript / TypeScript", level: 90, xp: 4, icon: "bi-filetype-js" },
      { name: "Bootstrap / Tailwind CSS", level: 88, xp: 4, icon: "bi-bootstrap" },
      { name: "Three.js / WebGL", level: 75, xp: 2, icon: "bi-box" }
    ],
    backend: [
      { name: "Node.js / Express", level: 85, xp: 3, icon: "bi-node-plus" },
      { name: "Python / Django / Flask", level: 80, xp: 3, icon: "bi-filetype-py" },
      { name: "Go / gRPC", level: 70, xp: 1, icon: "bi-server" },
      { name: "SQL (Postgres, MySQL)", level: 82, xp: 3, icon: "bi-database" },
      { name: "NoSQL (MongoDB, Redis)", level: 84, xp: 3, icon: "bi-database-fill" }
    ],
    devops: [
      { name: "Docker & Containers", level: 78, xp: 2, icon: "bi-hdd-network" },
      { name: "Git & GitHub Actions", level: 90, xp: 5, icon: "bi-git" },
      { name: "Firebase & Serverless", level: 85, xp: 3, icon: "bi-cloud" },
      { name: "Linux / Bash Scripting", level: 80, xp: 4, icon: "bi-terminal" }
    ]
  },

  experience: [
    {
      company: "TechCorp Inc.",
      role: "Senior Frontend Engineer",
      period: "2024 - Present",
      points: [
        "Led a team of 4 front-end engineers in rewriting a legacy web portal to Next.js, increasing Lighthouse performance score by 35 points.",
        "Developed a custom shared component library using Bootstrap and Sass, reducing overall layout CSS bundle size by 40%.",
        "Implemented end-to-end testing with Playwright, decreasing production bugs by 18%."
      ]
    },
    {
      company: "SoftWave Systems",
      role: "Full Stack Developer",
      period: "2022 - 2024",
      points: [
        "Built and maintained responsive microservices using Node.js, Docker, and MongoDB, handling over 250,000 daily requests.",
        "Refactored state management to Redux Toolkit across major web-apps, improving application startup speed by 1.2 seconds.",
        "Created an interactive charts dashboard that optimized data loading via selective server caching."
      ]
    },
    {
      company: "Innovate Labs",
      role: "Software Engineering Intern",
      period: "2021",
      points: [
        "Collaborated with backend engineers to integrate REST APIs in a React application.",
        "Developed automated bash scripts to run deployment verification checks.",
        "Assisted in maintaining technical documentation and writing unit test coverages."
      ]
    }
  ],

  education: [
    {
      degree: "B.S. in Computer Science",
      school: "State University",
      period: "2018 - 2022",
      description: "GPA 3.8/4.0. Core courses in Algorithms, Software Engineering, and Web Systems."
    }
  ],

  system: {
    wallpapers: [
      { name: "Bloom Light (Default)", value: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 30%, #e1befa 70%, #d1c4e9 100%)", isDark: false },
      { name: "Bloom Dark", value: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #311042 75%, #020617 100%)", isDark: true },
      { name: "Sunset Wave", value: "linear-gradient(135deg, #4c0519 0%, #7c2d12 35%, #9a3412 60%, #1e1b4b 100%)", isDark: true },
      { name: "Nordic Frost", value: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 30%, #cbd5e1 60%, #94a3b8 100%)", isDark: false }
    ],
    updates: {
      status: "Up to date",
      lastChecked: "Today at 9:00 AM",
      version: "OS Build 22621.1702"
    }
  }
};
// Export for use in index.html/app.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioData;
}
