export interface IChallan {
  license: string
  vehicleNo: string
  date: Date
  policeOfficer: string
  offence: string
  fineAmount: number 
  dueDate: Date
  coordinates: {
    latitute: number,
    longitude: number,
  }
}
