import readline from 'node:readline/promises';
import Groq from "groq-sdk";

const expenseDB = [];
const incomeDB = [];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callAgent() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages = [
    {
      role: "system",
      content: `you are jhon, a personal finance assistant. You can call functions to help the user. If a user asks about total expenses, balance, or affordability (e.g. "can I buy a car"), call the appropriate tool like getMoneyBalance or getTotalExpense before responding.


You have access to these tools:
1. getTotalExpense  // Get total expense between dates
2. addExpense       // Add a new expense
3. addIncome        // Add a new income
4. getMoneyBalance  // Get remaining money balance

Current datetime: ${new Date().toUTCString()}`,
    },
  ];

  while (true) {
    const question = await rl.question("user: ");
    messages.push({
      role: "user",
      content: question,
    });

    if (question.toLowerCase() === 'bye') {
      rl.close();
      break;
    }

    while (true) {
      const completion = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        tools: [
          {
            type: "function",
            function: {
              name: "getTotalExpense",
              description: "Get total expense between two dates.",
              parameters: {
                type: "object",
                properties: {
                  from: {
                    type: "string",
                    description: "Start date (YYYY-MM-DD)",
                  },
                  to: {
                    type: "string",
                    description: "End date (YYYY-MM-DD)",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "addExpense",
              description: "Add a new expense entry.",
              parameters: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the expense (e.g., bought groceries)",
                  },
                  amount: {
                    type: "string",
                    description: "Amount spent (in INR)",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "addIncome",
              description: "Add a new income entry.",
              parameters: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Source of income (e.g., salary)",
                  },
                  amount: {
                    type: "string",
                    description: "Amount received (in INR)",
                  },
                },
              },
            },
          },
          {
            type: "function",
            function: {
              name: "getMoneyBalance",
              description: "Get current balance (total income - total expenses).",
              parameters: {
                type: "object",
                properties: {},
              },
            },
          },
        ],
      });

      const reply = completion.choices[0].message;
      messages.push(reply);

      const toolCalls = reply.tool_calls;

      if (!toolCalls) {
        console.log(`Assistant: ${reply.content}`);
        break;
      }

      for (const tool of toolCalls) {
        const functionName = tool.function.name;
        const functionArgs = tool.function.arguments
          ? JSON.parse(tool.function.arguments)
          : {};

        let result = "";
        if (functionName === "getTotalExpense") {
          result = getTotalExpense(functionArgs);
        } else if (functionName === "addExpense") {
          result = addExpense(functionArgs);
        } else if (functionName === "addIncome") {
          result = addIncome(functionArgs);
        } else if (functionName === "getMoneyBalance") {
          result = getMoneyBalance();
        }

        messages.push({
          role: "tool",
          content: result,
          tool_call_id: tool.id,
        });
      }

      // Follow-up message from the assistant
      const followUp = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
      });

      console.log(`Assistant: ${followUp.choices[0].message.content}`);
      messages.push(followUp.choices[0].message);
      break;
    }
  }
}

// === Tool Implementations ===

function getTotalExpense({ from, to }) {
  const total = expenseDB.reduce((acc, item) => acc + item.amount, 0);
  return `${total} INR spent (note: date filtering not implemented yet).`;
}

function addExpense({ name, amount }) {
  expenseDB.push({ name, amount: parseFloat(amount) });
  return `Added expense: ${name} - ₹${amount}`;
}

function addIncome({ name, amount }) {
  incomeDB.push({ name, amount: parseFloat(amount) });
  return `Added income: ${name} - ₹${amount}`;
}

function getMoneyBalance() {
  const income = incomeDB.reduce((acc, item) => acc + item.amount, 0);
  const expense = expenseDB.reduce((acc, item) => acc + item.amount, 0);
  return `Your current balance is ₹${income - expense}`;
}

// Start the assistant
callAgent();
