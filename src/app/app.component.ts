import { Component } from '@angular/core';
import { Coords } from 'src/structures/coords.structure';
import { CurrentWeatherService } from './services/current-weather.service';
import { GeolocationService } from './services/geolocation.service';
import { LoadingService } from './services/loading.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  coords: Coords;
  title = 'weather';
  appKey = environment.key;

  constructor(
    public currentWeatherService: CurrentWeatherService,
    public geoLocationService: GeolocationService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.splash();
    this.geoLocationService.requestGeolocation();
    this.geoLocationService.coords$.subscribe(
      (coords) => (this.coords = coords)
    );
  }
}
