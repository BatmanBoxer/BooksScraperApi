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

const scrapeSearch = async (id) => {
  const list = [];
  const user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
  ];
  const randomUserAgent = user_agents[Math.floor(Math.random() * user_agents.length)];
  try {
    const response = await axios.get(baseSearchUrl + id, {
      headers: {
        'User-Agent': randomUserAgent,
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
