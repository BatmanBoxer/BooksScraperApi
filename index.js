import express from "express";
import search  from "./search.js";
import description from "./description.js";

const port = "4000"
const app = express();

app.use("/search",search);
app.use("/description",description);

app.listen(port,()=>{
  console.log(`server is running in port ${port}`)
})
