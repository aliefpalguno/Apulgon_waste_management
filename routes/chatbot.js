const express = require('express');
const axios = require('axios');

const router = express.Router();

module.exports = (io) => {
  router.post('/post-chatbot', async (req, res) => {
    const { prompt } = req.body;

    const data = {
      input: { prompt },
      parameters: {},
      debug: {}
    };

    try {
      const response = await axios.post(process.env.API_URL, data, {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const textOutput = response.data.output.text;
      const socketId = req.headers['x-socket-id']; // Ambil ID socket dari header

      // Kirimkan hasil hanya ke socket dengan ID yang sesuai
      if (socketId) {
        io.to(socketId).emit('dataset-updated', textOutput);
      }

      res.send(textOutput);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).send('Something went wrong!');
    }
  });

  return router;
};
