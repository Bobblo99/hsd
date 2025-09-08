// @ts-nocheck  // optional, wenn du den Typchecker hier nicht willst

const { sdk, databases, dbId, collectionId } = require("./index");

async function setupCustomerCollection() {
  try {
    // 1. Collection prüfen oder anlegen
    let collection;
    try {
      collection = await databases.getCollection(dbId, collectionId);
      console.log("ℹ️ Collection existiert bereits:", collection.$id);
    } catch (err) {
      console.log("➕ Collection wird erstellt...");
      collection = await databases.createCollection(
        dbId,
        collectionId,
        "Customers",
        ["role:all"]
      );
      console.log("✅ Collection erstellt:", collection.$id);
    }

    const existing = (
      await databases.listAttributes(dbId, collectionId)
    ).attributes.map((a) => a.key);

    const ensureAttribute = async (fn, key, ...args) => {
      if (!existing.includes(key)) {
        console.log(`➕ Attribut "${key}" wird erstellt...`);
        await fn(dbId, collectionId, key, ...args);
      } else {
        console.log(`✔ Attribut "${key}" existiert bereits`);
      }
    };

    // Attribute mit englischen Keys, deutschen Values
    await ensureAttribute(
      databases.createStringAttribute.bind(databases),
      "name",
      255,
      true
    );
    await ensureAttribute(
      databases.createStringAttribute.bind(databases),
      "email",
      255,
      true
    );
    await ensureAttribute(
      databases.createStringAttribute.bind(databases),
      "phone",
      50,
      true
    );

    await ensureAttribute(
      databases.createEnumAttribute.bind(databases),
      "rimDamaged",
      ["ja", "nein"],
      true
    );

    await ensureAttribute(
      databases.createEnumAttribute.bind(databases),
      "repairType",
      ["lackieren", "polieren", "schweissen", "pulverbeschichten"],
      true
    );

    await ensureAttribute(
      databases.createStringAttribute.bind(databases),
      "damageDescription",
      2000,
      true
    );
    await ensureAttribute(
      databases.createStringAttribute.bind(databases),
      "imageIds",
      255,
      false,
      undefined,
      true
    );
    await ensureAttribute(
      databases.createEnumAttribute.bind(databases),
      "status",
      ["eingegangen", "in-bearbeitung", "fertiggestellt", "abgeholt"],
      true
    );
    await ensureAttribute(
      databases.createDatetimeAttribute.bind(databases),
      "createdAt",
      true
    );
    await ensureAttribute(
      databases.createDatetimeAttribute.bind(databases),
      "updatedAt",
      true
    );

    console.log("✅ Setup abgeschlossen!");
  } catch (err) {
    console.error("❌ Fehler beim Setup:", err);
  }
}

setupCustomerCollection();
