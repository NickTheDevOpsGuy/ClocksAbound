# 🕰️ ClocksAbound

_A raccoon-approved dashboard for global domination — one time zone at a time._ 🦝

[![CI](https://github.com/NickTheDevOpsGuy/ClocksAbound/actions/workflows/ClocksAbound.yml/badge.svg)](https://github.com/NickTheDevOpsGuy/ClocksAbound/actions/workflows/ClocksAbound.yml)
![Last Commit](https://img.shields.io/github/last-commit/NickTheDevOpsGuy/ClocksAbound)
![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb?logo=react&logoColor=white)

![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38bdf8?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/github/license/NickTheDevOpsGuy/ClocksAbound)
![Contributions welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)

---

## 📘 Table of Contents

- [🖼 Preview](#-preview)
- [🕰️ About ClocksAbound](#️-about-clocksabound)
- [🚀 Features](#-features)
- [🛣️ Roadmap](#️-roadmap)
- [🧭 Extended Roadmap](#-extended-roadmap)
- [🧱 Tech Stack](#-tech-stack)
- [📦 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [🦝 Built by NickDoesDevOps](#-built-by-nickdoesdevops)

---

## 🖼 Preview

### Main App Demo

![App Demo GIF](./public/assets/preview.gif)

> 🎞️ Captured directly from the live app

---

## 🕰️ About ClocksAbound

ClocksAbound is a minimal, fast React dashboard for tracking multiple time zones in real time.  
It started as a small UI exercise and evolved into a polished **MVP** focused on clarity, persistence, and smooth interaction.

### 🧭 Purpose

To simplify cross-timezone collaboration — perfect for remote teams, global projects, or anyone scheduling across regions.

---

## Acknowledgements

A big thanks to the kind contributions of developers who have helped improve the project!

Every commit, idea, and bug report makes the game better.

[![Contributors](https://contrib.rocks/image?repo=NickTheDevOpsGuy/ClocksAbound)](./CONTRIBUTORS.md)

Meet all our amazing [Contributors](./CONTRIBUTORS.md).

---

## 🚀 Features

- 🌍 **Live Multi-Zone Dashboard** — add clocks for any timezone, updating in real time.  
- ⭐ **Favorites List** — pin, rename, and reorder your most important zones.  
- 🔍 **Smart Search & Abbreviation Lookup** — type `BST`, `EST`, or partial names to jump instantly.  
- 🕹️ **Drag-and-Drop Reordering** — rearrange your favorite clocks effortlessly.  
- 💾 **Persistence** — favorites and settings (12h/24h, show date, custom labels) saved automatically via Local Storage.  
- 🧭 **Offset Awareness** — shows GMT offset and how far ahead or behind each zone is from your local time.  
- 🗓️ **Optional Date Display** — toggle date visibility to match your preference.  
- ✏️ **Custom Labels** — rename any clock to something memorable (“HQ”, “Tokyo Ops”, “Yo Mamma Clock”).  
- 🖼️ **Refined UI / UX** — gradient background, smooth hover animations, aligned icons, and a cohesive dark theme.  
- ⚡ **React + TypeScript Core** — lightweight, fast, and strongly typed.  
- 🎨 **Tailwind UI** — built for clarity and accessibility, no heavy UI frameworks needed.  

---

## 🛣️ Roadmap

### ✅ Completed

- [x] 🌍 Live multi-zone dashboard
- [x] 💾 Persistence via Local Storage
- [x] ⭐ Favorites list with search & filter
- [x] 🧭 Offset awareness
- [x] 🕹️ Drag-and-drop to reorder favorite clocks
- [x] ✏️ Rename clocks (custom labels)
- [x] 🖼️ UI refresh with gradients, blur, and animation polish

---

### 🚧 In Progress / Planned

- [ ] 🌤️ Weather + daylight indicators
- [ ] 🧭 Relative time comparison — show how far each zone is from your local clock (e.g., “+8h ahead”)
- [ ] 📤 Share or export layout
- [ ] 🌓 Light / Dark theme toggle
- [ ] ⏰ Optional hourly chime
- [ ] 💬 Tooltips and accessibility refinements

💡 _Have an idea or feature request? Open an issue or discussion — feedback is always welcome!_

---

## 🧱 Tech Stack

ClocksAbound is built with a modern, minimal React setup focused on performance and simplicity.

| Category         | Technologies                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 🖥️ Frontend      | [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)                                                     |
| ⚡ Bundler       | [Vite](https://vitejs.dev/)                                                                                                     |
| 💅 Styling       | [Tailwind CSS](https://tailwindcss.com/)                                                                                        |
| 🧩 State & Hooks | React Hooks + Local Storage                                                                                                     |
| 🌙 Theme         | Light / Dark mode with accessible contrast                                                                                      |
| 🧭 Date & Time   | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API |
| 🧰 Tooling       | ESLint • Prettier • pnpm / npm                                                                                                  |

---

🧡 _Designed to be fast, accessible, and easy to extend — a playground for both design and logic._

---

## 📦 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/NickTheDevOpsGuy/ClocksAbound.git
   ```

2. **Install dependencies**

   ```bash
   npm i
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

<details>
<summary>📁 Click to expand file structure</summary>

```plaintext
.
├── .eslintcache
├── .github
│   ├── ISSUE_TEMPLATE
│   │   ├── bug.yml
│   │   ├── config.yml
│   │   ├── documentation.yml
│   │   ├── enhancement_refactor.yml
│   │   ├── feature_request.yml
│   │   └── question_discussion.yml
│   ├── pull_request_template.md
│   └── workflows
│       └── ClocksAbound.yml
├── .gitignore
├── .husky
│   ├── pre-commit
│   └── pre-push
├── .prettierignore
├── .prettierrc
├── .prettierrc.json
├── .prettierrc.yml
├── .stylelintrc.json
├── CONTRIBUTORS.md
├── eslint.config.js
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
├── public
│   ├── .DS_Store
│   └── assets
│       ├── .DS_Store
│       ├── clocksabound.svg
│       └── preview.gif
├── README.md
├── scripts
│   └── precheck.sh
├── src
│   └── app
│       ├── App.tsx
│       ├── components
│       │   ├── Clock.tsx
│       │   ├── SortableClock.tsx
│       │   └── ZonePicker.tsx
│       ├── hooks
│       │   └── useLocalStorage.ts
│       ├── lib
│       │   └── timezones.ts
│       ├── main.tsx
│       ├── styles
│       │   └── global.css
│       └── utils
│           └── move.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite-env.d.ts
└── vite.config.ts
```

</details>

---

## 🤝 Contributing

- 🐛 Report bugs in [Issues](../../../../issues)
- 💡 Suggest features or improvements
- 🔧 Open a Pull Request

---

## 🦝 Built by NickDoesDevOps

Created with ☕, curiosity, and a touch of chaos by [Nicholas Clark](https://www.linkedin.com/in/nickdoesdevops).  
Follow the journey → [GitHub](https://github.com/NickTheDevOpsGuy) • [LinkedIn](https://www.linkedin.com/in/nickdoesdevops)

🏷 #NickDoesDevOps • #LearningInPublic • #BuiltInPublic
