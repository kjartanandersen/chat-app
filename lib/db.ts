import { IMessage } from "@/types/Messages";
import { MongoClient } from "mongodb";

export async function connectToDatabase(dbName: string) {
  const client = MongoClient.connect(
    `mongodb+srv://dbAdmin:Pass.123@kjartancluster.mdfwu.mongodb.net/${dbName}?retryWrites=true&w=majority`
  );
  return client;
}
