import express from "express"
import { baseSearchUrl } from "./constants.js";
import axios from 'axios';

const route = express.Router();

route.get('/', async (req, res) => {
  try {
    // Log the incoming request headers
    console.log('Incoming Request Headers:', req.headers);

    // Extract headers from the incoming request

    const response = await axios.get(baseSearchUrl + "harry", {
      headers: {
        'User-Agent': req.headers['user-agent'], // Forward the correct User-Agent
      }
    });

    const data = response.data;
    res.json({ data: data });
  } catch (error) {
    console.error('Axios Error:', error.response ? error.response.data : error.message);
    res.json({ status: error.response ? error.response.data : error.message });
  }
});
export default route
