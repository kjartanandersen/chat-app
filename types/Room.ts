export interface ICreateRoomForm {
  name: string;
  createdBy: string;
}

export interface IRoomsWithId {
  _id: string;
  name: string;
  createdBy: string;
}
