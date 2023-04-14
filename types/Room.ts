export interface ICreateRoomForm {
  name: string;
  nameSlug: string;
  createdBy: string;
}

export interface IRoomsWithId {
  _id: string;
  name: string;
  nameSlug: string;
  createdBy: string;
}
