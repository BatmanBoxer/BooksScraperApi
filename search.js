import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { baseSearchUrl, failed, sucess } from './constants.js';
import { sanitizeList } from './commons.js';

const route = express.Router();


route.get('/', async (req, res) => {
  const query = req.query.q;
  if (query) {
    const user_agent = req.headers["user-agent"]
    const list = await scrapeSearch(query, user_agent);
    res.json({ status: sucess, books: list })
  } else {
    res.json({ status: failed })
  }
});

const scrapeSearch = async (id,user_agent) => {
  const list = [];
  try {
     const response = await axios.get(baseSearchUrl + id, {
      headers: {
        'User-Agent': req.headers['user-agent'],
      }
    });


    const html = response.data;
    const $ = cheerio.load(html)
    const books = $("#aarecord-list .flex.flex-col.justify-center")
    books.each((_, element) => {
      const searchJson = {
        id: "",
        name: "",
        author: "",
        publication: "",
        img: "",
      }
      const link = $(element).find("a.items-center");
      const linkHref = link.attr("href");

      const img = $(element).find("img.relative");
      const imgSrc = img.attr("src");

      const name = $(element).find("h3");
      const publication = $(element).find(".truncate");
      const author = $(element).find(".italic");

      searchJson.name = name.text()
      if (typeof (linkHref) == "string") {
        searchJson.id = linkHref.split("/")[2]
      }
      searchJson.publication = publication.text()
      searchJson.author = author.text();
      searchJson.img = imgSrc

      list.push(searchJson);
    })
    const sanitizedList = sanitizeList(list)
    return sanitizedList;
  } catch (error) {
    console.log(error)
    return ({ status: error });
  }
}



export default route;
