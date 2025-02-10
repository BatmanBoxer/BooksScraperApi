import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { baseSearchUrl } from './constants.js';

const route = express.Router();


route.get('/', async (req, res) => {
    const request = await axios.get(baseSearchUrl+"harry")
    const data = request.data

    res.json({ data:data })
});

export default route
