# 💰 jhon – Personal Finance Assistant (CLI)

jhon is a command-line-based AI finance assistant built with Node.js and Groq's LLaMA 3. It helps you manage personal income and expenses using natural language, like:

💬 I got my salary of 20,000
💬 I bought a pen for 20 rs
💬 What is my current balance?
💬 Can I buy a car for 50,000?


Vidushi uses Groq's tool calling to run real-time functions like adding expenses, calculating balances, and checking affordability — all powered by LLMs.

---

## ✨ Features

- 💡 Add expenses/incomes in natural language  
- 📊 Get your current money balance  
- 📉 Track total expenses  
- 🤖 Groq LLaMA-3.3-70B with tool calling  
- 💻 Runs directly in your terminal  

---

## ⚙️ Technologies

- [Node.js](https://nodejs.org/)
- [Groq SDK](https://www.npmjs.com/package/groq-sdk)
- [LLaMA 3](https://groq.com/)
- Native readline for CLI input

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/crazyraturi/expense-tracker.git
cd expense-tracker

2. Install dependencies

npm install

3. Add your Groq API key

Create a .env file:

touch .env

Add your Groq API key:

GROQ_API_KEY=your_actual_api_key_here

4. Run the assistant

node financeAssistant.js

🧪 Sample Conversation

user: I got my salary of 20000
Assistant: Added income: salary - ₹20000

user: I bought a phone for 10000
Assistant: Added expense: phone - ₹10000

user: What's my current balance?
Assistant: Your current balance is ₹10000

user: Can I buy a car of 15000?
Assistant: Your current balance is ₹10000 — you’re short of ₹5000. Consider saving more before this purchase.

🛠 Future Improvements

    Date-based expense tracking

    File/database persistence for incomes/expenses

    Exporting monthly reports

    Web-based interface

    Voice command support

📁 File Structure

📦 vidushi-finance-assistant
├── financeAssistant.js   # Main assistant logic
├── .env                  # API key for Groq
├── package.json
└── README.md

📄 License

MIT
🙌 Credits

Built by Your Name using Groq + Node.js
Inspired by real-world personal finance struggles 💸