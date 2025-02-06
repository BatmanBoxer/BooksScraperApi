import express from "express"
import { baseDescriptionUrl, downloadsBaseUrl, failed, sucess } from "./constants.js";
import axios from 'axios';
import * as cheerio from "cheerio";

const route = express.Router();

route.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (id) {
    const data = await scrapeDescription(id);
    res.json({ "status": sucess, data })
  } else {
    res.json({ "status": failed })
  }
});

const scrapeDescription = async (id) => {
  try {
    const data = {
      img: "",
      description: "",
      download: "",
    }
    const request = await axios.get(baseDescriptionUrl + id);
    const html = request.data;
    const $ = cheerio.load(html);

    const img = $("img.absolute");
    const bookInfo = $("div.js-md5-top-box-description");
    const bookDescription = $(bookInfo).find("div.mb-1").first();

    const ul = $("ul.js-show-external");
    const li = $(ul).find("li.list-disc");
    const filteredLi = li.filter((index, element) => {
      const a = $(element).find("a");
      const href = a.attr("href");
      if (href && href.includes("libgen.li")) {
        return true;
      }
      return false;
    });
    const a = $(filteredLi).find("a")

    data.img = img.attr("src");
    data.description = bookDescription.text();
    data.download = await scrapeDownloads(a.attr("href"))
    return data
  } catch (error) {
    return ({ "status": failed })
  }
}

const scrapeDownloads = async (url) => {
  try {
    const request = await axios.get("https://libgen.li/ads.php?md5=af56c54f230a2fc30c3474071bc4a0d9");
    const html = request.data;
    const $ = cheerio.load(html);
    
    const td = $("td");
    const a = $(td).find("a");
    return(downloadsBaseUrl+a.attr("href")) 
  } catch (error) {
    console.log(error)
    return failed
  }
}
export default route

