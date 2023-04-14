

export const hasRooms = () => {


}

export const createRoomSlug = (roomName: string) => {
  return roomName.toLowerCase().replace(/\s/g, "-");
}
