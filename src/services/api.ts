import axios from 'axios'
let base: string;
base = 'https://api.openweathermap.org/data/2.5';
//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
const api = axios.create({
    baseURL: base,
});


export default api;