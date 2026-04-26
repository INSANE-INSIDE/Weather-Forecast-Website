import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FirstApp.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = "c99b4610c55a63f6fff700aea351829f";

  const getWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      setError('');

      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(url);

      setWeather(response.data);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherData(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError("Location permission denied");
      }
    );
  }, []);

  const searchCity = async (e) => {
    if (e.key === 'Enter') {
      try {
        setLoading(true);
        setError('');

        const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        const geoRes = await axios.get(geoUrl);

        getWeatherData(geoRes.data.coord.lat, geoRes.data.coord.lon);
        setCity('');
      } catch (err) {
        setError("City not found!");
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <div className="search-box">
        <input 
          type="text"
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          onKeyDown={searchCity}
          placeholder="Type city and press Enter..."
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      
      {weather && !loading && (
        <div className="weather-info">
          <h1>{weather.city.name}</h1>

          <div className="temp">
            {Math.round(weather.list[0].main.temp)}°C
          </div>

          <p className="desc">
            {weather.list[0].weather[0].description}
          </p>

          <img 
            src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`} 
            alt="weather icon"
          />

          <div className="forecast">
            {weather.list
              .filter((_, i) => i % 8 === 0)
              .map((day, i) => (
                <div key={i} className="day-card">
                  <p>
                    {new Date(day.dt_txt).toLocaleDateString('en', { weekday: 'short' })}
                  </p>
                  <strong>{Math.round(day.main.temp)}°C</strong>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;