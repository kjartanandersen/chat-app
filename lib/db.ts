import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = MongoClient.connect('mongodb+srv://dbAdmin:Pass.123@kjartancluster.mdfwu.mongodb.net/chat-app?retryWrites=true&w=majority');
  return client;
};
