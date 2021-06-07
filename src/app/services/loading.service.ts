import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingTime: number = 3000;
  public loading: boolean = true;
  constructor() {}

  splash() {
    setTimeout(() => {
      this.loading = false;
    }, this.loadingTime);
  }
}
