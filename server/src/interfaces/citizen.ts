export interface ICitizen {
  name: { type: string }
  personal: {
    address: string
    phNum: string
    email: string
    license: string
  }
  offences: {
    Paid: string[]
    Unpaid: string[]
  }
  registered_vehicle_no: string
}
//functions for make payment, get receipt and report offence.
