import { Injectable } from '@angular/core';
import * as moment from "moment";

@Injectable()
export class ConverterService {

  constructor() { }

  public durationToString(duration: number): string {
    const mDuration =  moment.duration(duration*1000);
    return [mDuration.hours(), mDuration.minutes(), mDuration.seconds()]
      .map(x => x > 9 ? ''+x : '0'+x).join(':');
  }
}
