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
export class ForecastService {
  weatherSubject: Subject<any> = new Subject<any>();
  weather$: Observable<any> = this.weatherSubject.asObservable();

  endpoint: string = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(
    private http: HttpClient,
    private geolocationService: GeolocationService
  ) {
    this.weather$ = this.weatherSubject
      .asObservable()
      .pipe(map(this.structureData));

    this.geolocationService.coords$.subscribe((coords) => {
      this.get(coords);
    });
  }

  structureData(data: any) {
    const minMaxPerDay: { [key: string]: Weather } = {};
    data.list.forEach((weatherObject: any) => {
      const date = new Date(weatherObject.dt * 1000);
      const hours = date.getHours();
      const month =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : `${date.getMonth()}`;
      const day =
        date.getDate() + 1 < 10
          ? `0${date.getDate() + 1}`
          : `${date.getDate()}`;
      const key = `${month}-${day}`;

      let tempPerDay: Weather = minMaxPerDay[key] || {
        minMaxTemp: {},
      };

      if (!tempPerDay.cod) {
        const source = weatherObject.weather[0];
        tempPerDay = {
          ...tempPerDay,
          ...source,
          cod: source.id,
          name: data.city.name,
        };
      }

      if (
        !tempPerDay.minMaxTemp.min ||
        weatherObject.main.min > weatherObject.main.temp_min
      ) {
        tempPerDay.minMaxTemp.min = weatherObject.main.temp_min;
      }

      if (
        !tempPerDay.minMaxTemp.max ||
        weatherObject.main.max < weatherObject.main.temp_max
      ) {
        tempPerDay.minMaxTemp.max = weatherObject.main.temp_max;
      }

      minMaxPerDay[key] = tempPerDay;
    });

    return Object.values(minMaxPerDay);
  }

  get(coords: Coords) {
    const { lat, lon } = coords;
    const query = `?lat=${lat}&lon=${lon}&APPID=${environment.key}&units=metric`;
    let url = `${this.endpoint}${query}`;

    this.http.get(url).subscribe((data) => this.weatherSubject.next(data));
  }
}
