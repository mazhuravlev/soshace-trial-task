import { TestBed, inject } from '@angular/core/testing';

import { ConverterService } from './converter.service';

describe('ConverterService', () => {
  let converter: ConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConverterService]
    });
    converter = TestBed.get(ConverterService);
  });

  it('should be created', () => {
    expect(converter).toBeTruthy();
  });

  it('convert zero duration to string',() => {
    expect(converter.durationToString(0)).toEqual('00:00:00');
  });

  it('convert seconds duration to string', () => {
    expect(converter.durationToString(1000)).toEqual('00:00:01');
  });

  it('convert minutes duration to string', () => {
    expect(converter.durationToString(60000)).toEqual('00:01:00');
  });

  it('convert hours duration to string', () => {
    expect(converter.durationToString(3600000)).toEqual('01:00:00');
  });

  it('convert string to zero duration', () => {
    expect(converter.stringToDuration('00:00:00')).toEqual(0);
  });

  it('convert string to seconds duration', () => {
    expect(converter.stringToDuration('00:00:01')).toEqual(1000);
  });

  it('convert string to minutes duration', () => {
    expect(converter.stringToDuration('00:01:00')).toEqual(60000);
  });

  it('convert string to hours duration', () => {
    expect(converter.stringToDuration('01:00:00')).toEqual(3600000);
  });

  it('convert m to km', () => {
    expect(converter.metersToKm(1000)).toEqual(1);
  });

  it('convers ms to hours', () => {
    expect(converter.msToHours(0)).toEqual(0);
    expect(converter.msToHours(3600000)).toEqual(1);
  });
});
