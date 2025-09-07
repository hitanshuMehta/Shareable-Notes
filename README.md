# 📓 Shareable Notes App with AI Integration

A **rich-text notes application** built with React and TailwindCSS.  
Includes **AI-powered features** (summary, glossary, grammar check, tags) using **Gemini API**.  
Notes can be **created, edited, pinned, searched, and password-protected**.  
All data is stored securely in **localStorage** (no backend required).  

---

## 🚀 Features

- 📝 Custom Rich Text Editor (Bold, Italic, Underline, Alignment, Font Size)  
- 📌 Pin important notes  
- 🔍 Search notes by title/content  
- 🤖 AI Features (via Gemini API):  
  - Glossary Highlighting  
  - Summarization  
  - Tag Suggestions  
  - Grammar Check  
- 🔑 Password-protected notes  
- 📱 Fully responsive (mobile, tablet, desktop)  

---

## 🛠 Tech Stack

- **React.js**  
- **TailwindCSS**  
- **Context API**  
- **React Icons**  
- **React Hot Toast**  
- **Axios**  
- **DOMPurify**  
- **Gemini API**  

---

## 🔑 Environment Setup

Create a `.env` file in the root directory and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## 📦 Installation & Setup

Clone the repo and run the project:

```bash
git clone <your-repo-url>
cd shareable-notes-app
npm install
npm run dev
