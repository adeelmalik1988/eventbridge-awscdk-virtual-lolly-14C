/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listLollies = /* GraphQL */ `
  query ListLollies {
    listLollies {
      id
      recipientName
      message
      sender
      flavourTop
      flavourMedium
      flavourBottom
      lollyPath
    }
  }
`;
export const getLollyById = /* GraphQL */ `
  query GetLollyById($lollyId: String!) {
    getLollyById(lollyId: $lollyId) {
      id
      recipientName
      message
      sender
      flavourTop
      flavourMedium
      flavourBottom
      lollyPath
    }
  }
`;
