import {RecordDto} from "../../dto/record.dto";

export interface ReportRecord extends RecordDto {
  week : number;
  year: number;
}
