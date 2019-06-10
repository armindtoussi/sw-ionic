import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  /** Stored data. */
  private data: object = {};

  constructor() { }

  /**
   * Sets the data to be passed. 
   * 
   * @param id the id.
   * @param data the data to be stored and passed. 
   */
  setData(id: string, data: any): void {
    console.log("setting data: ", id, " Data: ", data);
    this.data[id] = data;
    console.log("this.data: ", this.data);
  }

  /**
   * Gets data stored in service. 
   * 
   * @param id the id to fetch data in the array. 
   */
  getData(id: string): object {
    return this.data[id];
  }
}
