
const http = require("http");
const fs = require("fs");
const request = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");
const arr = [1,2,3];



const replaceVal = (tempValue,orgValue) =>{
         let temperature = tempValue.replace("{%tempVal%}",(orgValue.main.temp-273).toFixed(2));
         temperature = temperature.replace("{%tempMinVal%}",(orgValue.main.temp_min-273).toFixed(2));
         temperature = temperature.replace("{%tempMaxVal%}",(orgValue.main.temp_max-273).toFixed(2));
         temperature = temperature.replace("{%location%}",orgValue.sys.country);
         temperature = temperature.replace("{%Country%}",orgValue.name);
         temperature = temperature.replace("{%tempStatus%}",orgValue.weather[0].description);
         console.log(orgValue.weather[0].description);
         return temperature;
         
}

const server = http.createServer((req,res)=>{

    if(req.url === "/") {
       request("https://api.openweathermap.org/data/2.5/weather?lat=30.7333&lon=76.7794&appid=944fe4e260ff1a013ca2de3fca077c0f").on("data",(chunk)=>{
        
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        console.log(arrData);  
        const realTimeData = arrData.map((val)=>{
           return replaceVal(homeFile,val);
        }).join("");
          res.write(realTimeData,(err)=>{
            console.log(err);
          })
       })
       .on("end",(err)=>{
          if(err) return console.log("connection closed due to errors ",err);

          res.end();
       })
     
    }
})

server.listen(8000,"127.0.0.1")