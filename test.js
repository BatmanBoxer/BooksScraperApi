import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { baseSearchUrl } from './constants.js';

const route = express.Router();


route.get('/', async (req, res) => {
  try{
     const request = await axios.get(baseSearchUrl + "harry", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });    const data = request.data
    res.json({ data:data })
  }catch(error){
    res.json({ status:error })
  }

});

export default route
