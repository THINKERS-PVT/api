const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;
const v1Router = require("./v1/routes");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Endpoint for all requests
app.use("*", async (req, res) => {
  const data = {
    "status": "ok",
    "url": req.originalUrl,
    "ip_address": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    "request_body": req.body,
    "request_method": req.method,
       lat: req.headers['x-vercel-ip-latitude'],
    lon: req.headers['x-vercel-ip-longitude'],
    city: req.headers['x-vercel-ip-city'],
    region:req.headers['x-vercel-ip-country-region'] ,
    country:req.headers['x-vercel-ip-country'],
    UA: req.headers['user-agent'],
    uuid: uuidv4(),
  date_time: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })

  };
  
  const { data: log, error } = await supabase.from('db_test').insert(data); 

  if (error) {
    console.error('Error inserting log:', error);
    res.status(500).send('Error inserting log');
  }
  else {
    console.log('Log inserted successfully:', log);
    // res.send(data);
   
    const _message=['company'];
     const rand_index = Math.floor(Math.random() * _message.length);
    
    res.send(data);
  }
});

// Use v1Router for version 1 API requests
app.use("/v1", v1Router);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});

