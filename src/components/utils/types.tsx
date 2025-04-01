export interface BookingPriceInterface {
  _id: string
  adventureId: string
  adventureType: string
  solo: string
  soloThreeStar: string
  soloFourStar: string
  soloFiveStar: string
  singleSupplementary: string
  singleSupplementaryThreeStar: string
  singleSupplementaryFourStar: string
  singleSupplementaryFiveStar: string
  standardThreeStar: string
  standardFourStar: string
  standardFiveStar: string
}

export interface sessionData {
  expires: string
  user: {
    name: string
    email: string
    id: string
  }
  jwt: string
}
