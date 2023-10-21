const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');
const cors = require('cors');

const app = express();
const port = 8000;

const openAIAPI = new openai({
    apiKey: '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',
  });

app.use(bodyParser.json());
app.use(cors());

app.post('/chat', async (req, res) => {
    try {
        const response = await openAIAPI.completions.create({
            model: 'text-davinci-003',
            prompt: req.body.prompt,
            max_tokens: 50,
            n: 1,
            stop: '\n',
        });

        res.json(response.choices[0].text);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while making the request to the OpenAI API.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
