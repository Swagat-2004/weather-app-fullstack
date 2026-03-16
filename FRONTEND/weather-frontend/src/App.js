import './App.css';
import { useState } from 'react';

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "8a1e04ed91686857e0e447309dff59a2";

  const handleSearch = async () => {

    if (city.trim() === "") {
      alert("Please enter a city name");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(`http://localhost:8080/weather/${city}`);

      if (!response.ok) {
        setWeather(null);
        setError("City not found");
        setLoading(false);
        return;
      }

      const data = await response.json();

      setWeather(data);
      setError("");

    } catch (error) {

      setWeather(null);
      setError("Unable to fetch weather data");

    } finally {

      setLoading(false);

    }
  };

  const getLocationWeather = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {

        setLoading(true);

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        const data = await response.json();

        const weatherData = {
          city: data.name,
          temperature: Math.round((data.main.temp - 273.15) * 10) / 10,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        };

        setWeather(weatherData);
        setError("");

      } catch (error) {

        setError("Unable to fetch location weather");

      } finally {

        setLoading(false);

      }

    });

  };

  return (
    <div className="App">

      <h1>Weather App</h1>

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />

      <button onClick={handleSearch}>Search</button>

      <button onClick={getLocationWeather}>
        Use My Location
      </button>

      {loading && <p>Loading...</p>}

      {error && <p style={{color:"red"}}>{error}</p>}

      {weather && (
        <div className="weather-card">

          <h2>{weather.city}</h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt="weather icon"
          />

          <p>🌡 Temperature: {weather.temperature} °C</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>☁ Description: {weather.description}</p>

        </div>
      )}

    </div>
  );
}

export default App;