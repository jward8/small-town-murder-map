import {GeoJson} from "./geojson"

export interface Episode {
    "vity": String,
    "country": String,
    "date": String,
    "episode": String,
    "geojson": GeoJson,
    "id": number,
    "link": String,
    "state": String,
    "title": String
}