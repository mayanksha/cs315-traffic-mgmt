export interface IChallan {
  license: string
  email: string
  vehicleNo: string
  date: Date
  policeOfficer: string
  offence: string
  fineAmount: number 
  dueDate: Date
  coordinates: {
    latitude: number,
    longitude: number,
  },
  paymentStatus: boolean,
}
