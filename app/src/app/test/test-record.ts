import {RecordDto} from "../dto/record.dto";

export class TestRecord {
  public static get(): RecordDto {
    return {
      _id: "5a3e66d665bdd91404718c74",
      date: "2017-12-23T14:23:12.588Z",
      distance: 1000,
      duration: 180000,
    };
  }
}
