import {Pipe, PipeTransform} from '@angular/core';
import {ConverterService} from "../services/converter.service";

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  constructor(private converterService: ConverterService) {
  }

  transform(seconds: number, args?: any): string {
    return this.converterService.durationToString(seconds);
  }

}
