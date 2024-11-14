import { useState } from "react";
import Select from "react-select";
import CountryFlag from "react-country-flag";
import { Country, City } from "country-state-city";
import axios from "axios";
import "./App.css";

// Get country options with flags
const countryOptions = Country.getAllCountries().map((country) => ({
  value: country.isoCode,
  label: (
    <div style={{ display: "flex", alignItems: "center" }}>
      <CountryFlag
        countryCode={country.isoCode}
        svg
        style={{ marginRight: 8 }}
      />
      {country.name}
    </div>
  ),
}));

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = "393fe2e5c362b2c538ec68c364cd57d3"; 

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    const cities = City.getCitiesOfCountry(option.value).map((city) => ({
      value: city.name,
      label: city.name,
    }));
    setCityOptions(cities);
    setSelectedCity(null);
  };

  const handleSearch = async () => {
    if (selectedCity && selectedCountry) {
      try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(selectedCity.value)},${selectedCountry.value}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(apiUrl);

        setWeather(response.data);
        setError(null);

      } catch (err) {
        setError("Sorry, no weather data found for this city. Please check the name and try again.");
        setWeather(null);
      }
    } else {
      setError("Please select a country and city first.");
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Weather App</h1>
        <Select
          options={countryOptions}
          onChange={handleCountryChange}
          placeholder="Select a country"
          className="select"
        />
        {selectedCountry && (
          <Select
            options={cityOptions}
            onChange={(city) => setSelectedCity(city)}
            placeholder="Select a city"
            className="select"
          />
        )}
        <button onClick={handleSearch} className="search-button">
          Search
        </button>

        {error && <p className="error">{error}</p>}
        {weather && (
          <div className="weather-info">
            <h2>{weather.name}</h2>
            <p>{weather.main.temp}°C</p>
            <p>{weather.weather[0].description}</p>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt="Weather icon"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
