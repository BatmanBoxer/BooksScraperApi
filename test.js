import express from "express"
import { baseSearchUrl } from "./constants.js";
import axios from 'axios';

const route = express.Router();

route.get('/', async (req, res) => {
  try {
    console.log('Incoming Request Headers:', req.headers);
    const response = await axios.get(baseSearchUrl + "harry", {
      headers: {
        'User-Agent': req.headers['user-agent'],
        'Referer': 'https://annas-archive.org/',  // or the page you're scraping from
        'Origin': 'https://annas-archive.org/',
      }
    });

    const data = response.data;
    res.json({ data: data });
  } catch (error) {
    res.json({ status: error });
  }
});
export default route
