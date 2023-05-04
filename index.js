const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

app.use(bodyParser.json());

app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: message,
        max_tokens: 60,
        temperature: 0.7,
        n: 1,
        stop: '\n',
      })
    });

    const data = await response.json();
    const reply = data.choices[0].text.trim();

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred. Please try again later.' });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
