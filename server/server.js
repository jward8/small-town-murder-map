const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const https = require('https');
let Parser = require('rss-parser');
const axios = require('axios');
const { response } = require('express');
const dateMath = require('date-arithmetic');

const CONSTANTS = {
    RSS_URL: 'https://www.omnycontent.com/d/playlist/aaea4e69-af51-495e-afc9-a9760146922b/46c6373e-26ec-4a0d-a300-aadc0017dd97/e67fc310-4408-4735-8916-aadc0017dda5/podcast.rss',
    OPENCAGE_URL: 'https://api.opencagedata.com/geocode/v1/json',
    OPENCAGE_API_KEY: 'e4266ab7583a4e048703406e0da69520'
}

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

const app = express(),
    bodyParser = require("body-parser"),
    port = 3080;

const users = [];

app.use(bodyParser.json(), function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/rssData', async (req, res) => {
    const RSS_data = {
        'data': []
    }

    const parser = new Parser();

    const feed = await parser.parseURL(CONSTANTS.RSS_URL);

    var id = 1;

    feed.items.forEach(item => {
        const data_temp = {
            'id': 0,
            'title': '',
            'episode': '',
            'city': '',
            'state': '',
            'country': '',
            'date': '',
            'link': ''
        }

        data_temp['id'] = id++;
        var title = item['title'];
        data_temp['title'] = title;
        data_temp['date'] = new Date(item['isoDate']);
        data_temp['link'] = item['link'];

        // if(data_temp['id'] === 1){
        //     let latestDate = data_temp['date'];
        //     fs.writeFile('latestDate.txt', latestDate.toString(), function(err,data){
        //         if(err){
        //             return console.log(err);
        //         }
        //         console.log(data)
        //     });
        // }

        if(title.toLowerCase().includes('bonus')){
            return;
        }

        var part1Index = title.indexOf("- Part 1");
        var part2Index = title.indexOf("- Part 2");

        if(part1Index !== -1){
            title = title.substring(0, part1Index).trim();
        }
        if(part2Index !== -1){
            title = title.substring(0, part2Index).trim();
        }

        var split = title.split(" - ");
        if(split.length === 1){
            split = title.split("-");
        }
        const ep_num = split[0].trim();

        if(ep_num.includes("#")){
            data_temp['episode'] = ep_num.split("#")[1].substring(0,3);
        }else{
            data_temp['episode'] = ep_num;
        }

        if(data_temp['episode'] == "000" || isNaN(parseFloat(data_temp['episode']))){
            return;
        }
        

        if(split.length === 3){
            const location = split[2];
            const loc_split = location.split(", ");
            data_temp['city'] = loc_split[0];
            data_temp['state'] = loc_split[1];
            data_temp['country'] = 'US';
        }else if(split.length === 2){
            const location = split[1].split(" in ");
            const loc_split = location[1].split(", ");
            if(loc_split.length === 1){
                data_temp['city'] = 'Sarah';
                data_temp['state'] = loc_split[0];
                data_temp['country'] = 'US';
            }else if(loc_split.length === 2){
                if(loc_split[1].includes('U.K.')){
                    data_temp['city'] = loc_split[0];
                    data_temp['state'] = 'England';
                    data_temp['country'] = loc_split[1];
                }else{
                    data_temp['city'] = loc_split[0];
                    data_temp['state'] = loc_split[1];
                    data_temp['country'] = 'US';
                }
            }else{
                data_temp['city'] = loc_split[0];
                data_temp['state'] = loc_split[1];
                data_temp['country'] = loc_split[2];
            }
        }

        RSS_data['data'].push(data_temp);
    })

    res.send(RSS_data);
});

app.post('/api/coordinates', async (req, res) => {
    var data = [];

    req.body['data'].forEach(episode => {
        const model ={
            'title': episode['title'],
            'link': episode['link'],
            'coordinates': []
        }
        const request =  axios.get(CONSTANTS.OPENCAGE_URL,{
            params: {
                key: CONSTANTS.OPENCAGE_API_KEY,
                q: encodeURI(`${episode['city']}, ${episode['state']}`),
                limit: 1,
                no_annotations: 1
            }
        })
        .then(res => res['data'])
        .then(json => {
            model['coordinates'] = json['results'][0]['geometry'];
            data.push(model);
        });
    });
    setTimeout(() => res.send(data), 4000);
    setTimeout(() => fs.writeFile('murderinfo.json', JSON.stringify(data), function(err,data){
        if(err){
            return console.log(err);
        }
        console.log(data)
    }), 5000);
    setTimeout(() => data.length = 0, 6000);
});

app.get('/api/latestDate', (req, res) =>{
    fs.readFile('latestDate.txt', 'utf-8', (err, data) => {
        if(err) throw err;

        let date = new Date(data);
        let weekLater = dateMath.add(date, 7, 'day');
        let inRange = false;

        if((Date.now() > date) && (Date.now() < weekLater)){
            inRange = true;
        }
        res.send(inRange);
    })
});

app.get('/api/geojson', (req, res) => {
    fs.readFile('murderinfo.json', 'utf-8', (err, data) => {
        if(err) throw err;

        let collection = {
            "type": 'FeatureCollection',
            'features': []
        }

        let geojson = []

        let json_data = JSON.parse(data);

        json_data.forEach(episode => {
            let geojson_entry = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": []
                },
                "properties": {
                    "name": "",
                    "link": ""
                }
            }

            geojson_entry['geometry']['coordinates'] = [episode['coordinates']['lng'],episode['coordinates']['lat']];
            geojson_entry['properties']['name'] = episode['title'];
            geojson_entry['properties']['link'] = episode['link'];
            geojson.push(geojson_entry);
        });

        collection.features = geojson;

        res.send(collection);
    })
})

app.get('/', (req, res) => {
    res.send('App Works !!!!');
});

app.listen(port, ()=>{
    console.log(`Server listening on the port::${port}`);
});
