export interface IVehicle {
  vehicleNo: string
  vehicleType: string
  vehicleColor: string
  licenseNo: string
  // This is Vehicle Identification Number
  VINNo: string
  insurance: {
    insuredFrom: Date
    expiresAt: Date
    policyScheme: string
    policyNo: string
  } 
  registeredTo: string
  PAN_No: string
}
