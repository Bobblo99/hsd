// @ts-nocheck

const { sdk, databases, dbId, collectionId } = require("./index");

async function insertCustomer() {
  try {
    const doc = await databases.createDocument(
      dbId,
      collectionId,
      sdk.ID.unique(),
      {
        name: "Max Mustermann",
        email: "max@example.com",
        phone: "0123456789",
        rimDamaged: "ja",
        repairType: "lackieren",
        damageDescription: "Kratzer vorne links an der Felge",
        imageIds: [],
        status: "eingegangen",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );

    console.log("✅ Dokument erstellt:", doc);
  } catch (err) {
    console.error("❌ Fehler beim Erstellen:", err);
  }
}

insertCustomer();
