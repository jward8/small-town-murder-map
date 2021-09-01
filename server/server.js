const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const https = require('https');
let Parser = require('rss-parser');
const axios = require('axios');
const { response } = require('express');

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
            'link': '',
            'geojson': ''
        }

        data_temp['id'] = id++;
        var title = item['title'];
        data_temp['title'] = title;
        data_temp['date'] = new Date(item['isoDate']);
        data_temp['link'] = item['link'];

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
        
        storeCoordinates(data_temp['city'], data_temp['state']).then(res => {
            data_temp['geojson'] = res;
            console.log("1" + data_temp['geojson'])
            RSS_data['data'].push(data_temp);
        })
        
    })
    setTimeout(() => {
        res.send(RSS_data);
    }, 5000);
});

const storeCoordinates = async(city, state) => {
    let response = await getCoordinates(city, state);
    setTimeout(() => {return response}, 5000);
    return response;
}

async function getCoordinates(city, state) {
    let geojson_entry = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": []
        }
    }
    const res = await axios.get(CONSTANTS.OPENCAGE_URL,{
        params: {
            key: CONSTANTS.OPENCAGE_API_KEY,
            q: encodeURI(`${city}, ${state}`),
            limit: 1,
            no_annotations: 1
        }
    });

    const data = await res['data']['results'][0]['geometry'];
    
    geojson_entry['geometry']['coordinates'] = await data;

    return geojson_entry;
}

app.get('/', (req, res) => {
    res.send('App Works !!!!');
});

app.listen(port, ()=>{
    console.log(`Server listening on the port::${port}`);
});
