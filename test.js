import express, { response } from "express"
import { baseSearchUrl } from "./constants.js";
import axios from 'axios';

const route = express.Router();

route.get('/', async (req, res) => {
  try {
    console.log('Incoming Request Headers:', req.headers);
    const response = await axios.get("https://catfact.ninja/fact");

    const data = response.data;
    res.json({ data: data });
  } catch (error) {
    res.json({ status: error,"req":response});
  }
});
export default route
