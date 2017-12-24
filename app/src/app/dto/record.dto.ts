export interface RecordDto {
  _id?: string;
  date: Date | string;
  distance: number;
  // duration in ms
  duration: number
}
