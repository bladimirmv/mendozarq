import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { last } from 'rxjs/operators';


export interface locationList {
  icon?: string;
  name?: string;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationBarService {

  private locationList: BehaviorSubject<Array<locationList>> = new BehaviorSubject<Array<locationList>>([]);

  constructor() { }

  get locationList$(): Observable<Array<locationList>> {
    return this.locationList.asObservable();
  }

  public pushLocation(newLocation: object): void {
    const lastValue: Array<locationList> = this.locationList.getValue();
    lastValue.push(newLocation);
    this.locationList.next(lastValue);
  }

  public popLocation(): void {
    const lastValue: Array<locationList> = this.locationList.getValue();
    lastValue.pop();
    this.locationList.next(lastValue);
  }
  public setFirstLocation(): void {
    const first: Array<locationList> = [this.locationList.getValue().shift()];
    this.locationList.next(first);
  }
  public deleteLocation(): void {
    const voidList: locationList[] = [];
    this.locationList.next(voidList);
  }

}
