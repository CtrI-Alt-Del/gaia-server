export interface RawMeasurement {
  _id: string; 
  uid: string;
  uxt: number;
  receivedAt: Date; 
  topic: string;   
  [key: string]: any; 

}
