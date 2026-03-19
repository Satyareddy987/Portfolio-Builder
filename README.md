# PortfolioForge ✦

> **Build your developer portfolio in minutes — no signup, no framework, no backend.**

PortfolioForge is a fully browser-based portfolio generator. Fill in your details, pick a theme, and instantly download a single self-contained HTML file ready to deploy anywhere for free.

---

## 🚀 Live Demo

[Website Link](https://build-portfolio.vercel.app/)

---

## ✨ Features

- **Multi-step form builder** — Guided sections for every part of your portfolio
- **Skill categories** — Organize skills under Languages, Web Technologies, Tools, Database, and Concepts
- **Project cards** — Title, description, tech stack tags, live URL, and repo link
- **Work experience timeline** — Company, role, duration, and description
- **Education timeline** — Degree, college, year, grade, and status
- **Coding stats card** — Total questions, active days, contests, HackerRank badges, and Codolio profile link
- **Resume embedding** — Upload a PDF and it gets embedded as base64 — no external link needed
- **Theme presets** — Gold, Violet, Ocean, Forest, Rose, and Paper
- **Custom colors** — Pick your own background, accent, text, and card colors
- **Font selector** — Choose from Cormorant Garamond, Playfair Display, DM Sans, Lora, Space Grotesk, or Courier New
- **Single file output** — Downloads as one `.html` file with all CSS, JS, and assets inlined
- **Zero dependencies** — No npm, no build step, no framework

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts CDN |
| File handling | FileReader API (PDF → base64) |
| Download | Blob API + `URL.createObjectURL` |

---

## 📁 Project Structure

```
portfolioforge/
├── index.html      # Builder UI — landing page + multi-step form
├── style.css       # All styles for the builder interface
└── script.js       # State management, form logic, portfolio generator
```

---

## ⚡ Getting Started

No installation needed. Just open the file in your browser.

```bash
# Clone the repo
git clone https://github.com/your-username/portfolioforge.git

# Open in browser
cd portfolioforge
open index.html
```

Or simply download the ZIP and open `index.html` directly.

---

## 📦 How to Use

1. Open `index.html` in any modern browser
2. Click **Start Building**
3. Fill in your details across the sections:
   - Personal info, bio, and social links
   - Skills by category
   - Projects with tech stack and links
   - Work experience and education
   - Coding stats and Codolio profile
   - Contact info and resume PDF
4. Choose your theme preset, colors, and font
5. Click **✦ Generate & Download Portfolio**
6. Deploy the downloaded `.html` file anywhere

---

## 🌐 Deploy Your Portfolio (Free)

| Platform | How |
|---|---|
| **Netlify** | Drag and drop your `.html` file at [netlify.com/drop](https://app.netlify.com/drop) |
| **GitHub Pages** | Push to a repo → Settings → Pages → Deploy from branch |
| **Vercel** | Import repo or drop the file at [vercel.com](https://vercel.com) |

---

## 🎨 Theme Presets

| Name | Background | Accent |
|---|---|---|
| Gold | `#07070a` | `#c8a96e` |
| Violet | `#08080f` | `#9b87f5` |
| Ocean | `#060e1a` | `#38bdf8` |
| Forest | `#060f0a` | `#34d399` |
| Rose | `#0f080b` | `#fb7185` |
| Paper | `#f7f5f0` | `#92400e` |

---

## 🙌 Contributing

Pull requests are welcome! If you find a bug or have a feature suggestion, feel free to open an issue.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

Satya

---

<p align="center">Built with ✦ PortfolioForge · Free · No signup · Instant download</p>
