package com.example.weatherapp.service;

import com.example.weatherapp.model.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    public WeatherResponse getWeatherData(String city) {

        String url = "https://api.openweathermap.org/data/2.5/weather?q="
                + city + "&appid=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();

        try {

            Map<?, ?> response = restTemplate.getForObject(url, Map.class);

            if (response == null || response.get("main") == null) {
                throw new RuntimeException("City not found");
            }

            Map<?, ?> main = (Map<?, ?>) response.get("main");
            double tempKelvin = ((Number) main.get("temp")).doubleValue();
            int humidity = ((Number) main.get("humidity")).intValue();

            double tempCelsius = Math.round((tempKelvin - 273.15) * 10.0) / 10.0;

            List<?> weatherList = (List<?>) response.get("weather");
            Map<?, ?> weather = (Map<?, ?>) weatherList.get(0);
            String description = (String) weather.get("description");
            String icon = (String) weather.get("icon");

            String cityName = (String) response.get("name");

            return new WeatherResponse(cityName, tempCelsius, humidity, description, icon);

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("City not found");
        }
    }
}