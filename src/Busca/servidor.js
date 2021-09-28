import axios from 'axios'

// const url = 'http://api.openweathermap.org/data/2.5/weather?';
const key = '16ca7ebd2e46f53eba5b5e4256f3c8c1';

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

export const getWeatherData = async (cityname) => {

    try {
        const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${key}`);
        // console.log(data, `Opa`)
        return data;
    } catch (error) {
        throw error;
    }
}
