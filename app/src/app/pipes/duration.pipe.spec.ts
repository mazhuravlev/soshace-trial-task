import { DurationPipe } from './duration.pipe';
import {ApiService} from "../services/api.service";
import {inject, TestBed} from "@angular/core/testing";
import {ConverterService} from "../services/converter.service";

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConverterService]
    });
    pipe = new DurationPipe(TestBed.get(ConverterService));
  });

  afterEach(() => {
    pipe = null;
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transform zero duration to string', () => {
    expect(pipe.transform(0)).toEqual('00:00:00');
  });

  it('transform seconds duration to string', () => {
    expect(pipe.transform(1000)).toEqual('00:00:01');
  });

  it('transform minutes duration to string', () => {
    expect(pipe.transform(60000)).toEqual('00:01:00');
  });

  it('transform hours duration to string', () => {
    expect(pipe.transform(3600000)).toEqual('01:00:00');
  });
});
