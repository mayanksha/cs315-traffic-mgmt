export interface IAccident {
  reporterEmail: string,
  coordinates: {
    latitute: number,
    longitude: number,
  },
  date: Date,
  description: string
}
