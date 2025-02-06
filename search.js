import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { baseSearchUrl, failed } from './constants.js';
import { sanitizeList } from './commons.js';

const route = express.Router();


route.get('/', async (req, res) => {
  const query = req.query.q;
  if (query) {
    const list = await scrapeSearch(query);
    res.json({ status: list })
  } else {
    res.json({ status: failed })
  }
});

const scrapeSearch = async (id) => {
  const list = [];
  try {
    const response = await axios.get(baseSearchUrl + id);
    const html = response.data;
    const $ = cheerio.load(html)
    const books = $("#aarecord-list .flex.flex-col.justify-center")
    books.each((_, element) => {
      const searchJson = {
        status: "",
        id: "",
        name: "",
        author: "",
        publication: "",
        img: "",
      }
      const link = $(element).find("a.items-center");
      const linkHref = link.attr("href");

      const img =  $(element).find("img.relative");
      const imgSrc = img.attr("src");

      const name = $(element).find("h3");
      const publication = $(element).find(".truncate");
      const author = $(element).find(".italic");

      searchJson.name = name.text()
      searchJson.id = linkHref
      searchJson.publication = publication.text()
      searchJson.author = author.text();
      searchJson.img = imgSrc

      list.push(searchJson);
    })
    const sanitizedList = sanitizeList(list)
    return sanitizedList;
  } catch (error) {
    return ({ status: failed });
  }
}



export default route;
