import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Coords } from 'src/structures/coords.structure';
import { Weather } from 'src/environments/weather.structure';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentWeatherService {
  weatherSubject: Subject<any> = new Subject<any>();
  weather$: Observable<any> = this.weatherSubject.asObservable();

  endpoint: string = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private http: HttpClient,
    private geolocationService: GeolocationService
  ) {
    this.weather$ = this.weatherSubject.asObservable().pipe(
      map((data: any) => {
        const mainWeather = data.weather[0];
        const weather: Weather = {
          name: data.name,
          cod: data.cod,
          temp: data.main.temp,
          ...mainWeather,
        };
        return weather;
      })
    );

    this.geolocationService.coords$.subscribe((coords) => {
      this.get(coords);
    });
  }

  get(coords: Coords) {
    const { lat, lon } = coords;
    const query = `?lat=${lat}&lon=${lon}&APPID=${environment.key}&units=metric`;
    let url = `${this.endpoint}${query}`;

    this.http.get(url).subscribe((data) => this.weatherSubject.next(data));
  }
}
