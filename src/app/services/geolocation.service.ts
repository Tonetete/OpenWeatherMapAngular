import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Coords } from 'src/structures/coords.structure';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  public coords: Coords | undefined;
  public coordsSubject: Subject<Coords> = new Subject<Coords>();
  public coords$: Observable<Coords> = this.coordsSubject.asObservable();
  public permission$: Promise<string>;
  public coordsPromise: Promise<Coords> = null;

  constructor() {
    this.permission$ = (navigator as any).permissions
      .query({
        name: 'geolocation',
      })
      .then((permission) => permission.state);
  }

  async requestGeolocation() {
    this.coords = this.coords || (await this.getGeolocation());
    console.log(this.coords);
    this.coordsSubject.next(this.coords);
  }

  getGeolocation(): Promise<Coords> {
    return new Promise((success, rejected) => {
      if (!navigator || !('geolocation' in navigator)) {
        return rejected('Geolocation is not available.');
      }

      (navigator as any).geolocation.getCurrentPosition((position) => {
        console.log('position', position);
        success({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    });
  }
}
