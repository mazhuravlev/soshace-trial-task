import {Injectable} from '@angular/core';
import * as moment from "moment";
import * as _ from "lodash";
import {RecordDto} from "../dto/record.dto";

@Injectable()
export class ConverterService {

  constructor() {
  }

  // ms -> 00:00:00
  public durationToString(duration: number | null): string {
    if (duration === null) return '';
    const mDuration = moment.duration(duration);
    return [mDuration.hours(), mDuration.minutes(), mDuration.seconds()]
      .map(x => x > 9 ? '' + x : '0' + x).join(':');
  }

  // 00:00:00 -> ms
  public stringToDuration(str: string): number {
    return moment.duration(str).asMilliseconds();
  }

  public msToHours(milliseconds: number) {
    return milliseconds / 3600000;
  }

  public metersToKm(meters: number): number {
    return meters / 1000;
  }
}
