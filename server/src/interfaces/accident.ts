export interface IAccident {
  reporterEmail: string,
  coordinates: {
    latitude: number,
    longitude: number,
  },
  date: Date,
  description: string
}
