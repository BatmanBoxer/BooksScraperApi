import express from "express";
import search  from "./search.js";
import description from "./description.js";
import test from './test.js'

const port = "4000"
const app = express();

app.use("/search",search);
app.use("/description",description);
app.use("/test",test);

app.listen(port,()=>{
  console.log(`server is running in port ${port}`)
})
