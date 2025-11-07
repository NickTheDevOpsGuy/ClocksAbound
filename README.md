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

## 🖼 Preview

### Main App Demo

![App Demo GIF](./public/assets/preview.gif)

> 🎞️ _Previews are short animated GIFs recorded directly from the live app using screen capture — perfect for quick demos in READMEs._

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
- ⭐ **Favorites List** — pin and organize your key timezones for quick access.
- 🔍 **Smart Search & Abbreviation Lookup** — type `BST`, `EST`, or partial names to jump instantly.
- 🕹️ **Interactive Zone Picker** — clean dropdown with instant filtering and add button.
- 💾 **Persistence** — clocks and settings (12h/24h, show date) saved automatically via Local Storage.
- 🧭 **Offset Awareness** — shows GMT offset and how far ahead/behind each zone is from you.
- 🗓️ **Optional Date Display** — toggle on/off per preference.
- ⚡ **React + TypeScript Core** — fast, lightweight, and strongly typed.
- 🎨 **Tailwind UI** — minimal design built for clarity and accessibility.

---

## 🛣️ Roadmap

Planned features and improvements for upcoming versions:

- [ ] Drag-and-drop to reorder favorite clocks
- [ ] “My City” auto-detection and rename
- [ ] Share or export your layout
- [ ] PWA support for installable experience
- [ ] Light / Dark theme support
- [ ] Weather and daylight indicators
- [ ] Optional hourly chime

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
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── scripts
│   └── precheck.sh
├── src
│   └── app
│       ├── App.tsx
│       ├── components
│       │   ├── Clock.tsx
│       │   └── ZonePicker.tsx
│       ├── hooks
│       │   └── useLocalStorage.ts
│       ├── lib
│       │   └── timezones.ts
│       ├── main.tsx
│       └── styles
│           └── global.css
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
