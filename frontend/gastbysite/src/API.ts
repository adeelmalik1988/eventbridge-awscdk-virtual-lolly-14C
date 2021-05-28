/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateLollyInput = {
  id: string,
  recipientName: string,
  message: string,
  sender: string,
  flavourTop: string,
  flavourMedium: string,
  flavourBottom: string,
  lollyPath: string,
};

export type Lolly = {
  __typename: "Lolly",
  id?: string,
  recipientName?: string,
  message?: string,
  sender?: string,
  flavourTop?: string,
  flavourMedium?: string,
  flavourBottom?: string,
  lollyPath?: string,
};

export type CreateLollyMutationVariables = {
  lolly?: CreateLollyInput,
};

export type CreateLollyMutation = {
  createLolly?:  {
    __typename: "Lolly",
    id: string,
    recipientName: string,
    message: string,
    sender: string,
    flavourTop: string,
    flavourMedium: string,
    flavourBottom: string,
    lollyPath: string,
  } | null,
};

export type ListLolliesQuery = {
  listLollies?:  Array< {
    __typename: "Lolly",
    id: string,
    recipientName: string,
    message: string,
    sender: string,
    flavourTop: string,
    flavourMedium: string,
    flavourBottom: string,
    lollyPath: string,
  } | null > | null,
};

export type GetLollyByIdQueryVariables = {
  lollyId?: string,
};

export type GetLollyByIdQuery = {
  getLollyById?:  {
    __typename: "Lolly",
    id: string,
    recipientName: string,
    message: string,
    sender: string,
    flavourTop: string,
    flavourMedium: string,
    flavourBottom: string,
    lollyPath: string,
  } | null,
};
