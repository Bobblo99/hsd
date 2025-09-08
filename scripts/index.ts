// @ts-nocheck
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new sdk.Databases(client);

module.exports = {
  sdk,
  client,
  databases,
  dbId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  collectionId: process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID!,
};
