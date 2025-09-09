// @ts-nocheck
const { sdk, databases, dbId } = require("./index");

const CUST = "customers";
const FILES = "customerFiles";
const SERV = "customerServices";
const CNTR = "counters";

/* ---------------- Helpers ---------------- */

async function ensureCollection(id, name) {
  try {
    await databases.getCollection(dbId, id);
    console.log(`✔ Collection exists: ${id}`);
  } catch {
    await databases.createCollection(dbId, id, name, [
      sdk.Permission.read(sdk.Role.users()),
      sdk.Permission.create(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ]);
    console.log(`➕ Created collection: ${id}`);
  }
}

async function ensureAttr(colId, list, fn, key, ...args) {
  if (list.find((a) => a.key === key)) {
    console.log(`  ✔ attr ${colId}.${key}`);
    return false; // nicht neu angelegt
  }
  await fn(dbId, colId, key, ...args);
  console.log(`  ➕ attr ${colId}.${key}`);
  return true; // neu angelegt
}

async function ensureIndex(colId, list, key, type, attributes, orders) {
  if (list.find((i) => i.key === key)) {
    console.log(`  ✔ index ${colId}.${key}`);
    return;
  }
  await databases.createIndex(dbId, colId, key, type, attributes, orders);
  console.log(`  ➕ index ${colId}.${key}`);
}

/**
 * Warte bis alle gewünschten Attribute in status === "available" sind.
 * Pollt bis max timeoutMs (standard 30s).
 */
async function waitForAttributes(
  colId,
  keys,
  { timeoutMs = 30000, intervalMs = 800 } = {}
) {
  const start = Date.now();
  while (true) {
    const attrs = (await databases.listAttributes(dbId, colId)).attributes;
    const map = Object.fromEntries(attrs.map((a) => [a.key, a]));
    const allReady = keys.every((k) => map[k] && map[k].status === "available");
    if (allReady) return;
    if (Date.now() - start > timeoutMs) {
      const missing = keys.filter(
        (k) => !(map[k] && map[k].status === "available")
      );
      throw new Error(
        `Timeout waiting for attributes on ${colId}: ${missing.join(", ")}`
      );
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

/* --------------- customers (schlank) --------------- */

async function setupCustomers() {
  const colId = CUST;
  await ensureCollection(colId, "Customers");

  // aktuelle Attribute/Indizes holen
  let attrs = (await databases.listAttributes(dbId, colId)).attributes;
  let idxs = (await databases.listIndexes(dbId, colId)).indexes;

  // Stammdaten
  const createdFlags = [];
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "customerNumber",
      32,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createIntegerAttribute.bind(databases),
      "year",
      true
    )
  );

  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "firstName",
      128,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "lastName",
      128,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "fullName",
      260,
      true
    )
  );

  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "street",
      255,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "houseNumber",
      32,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "zipCode",
      16,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "city",
      128,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "fullAddress",
      400,
      true
    )
  );

  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "email",
      255,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "phone",
      50,
      true
    )
  );

  // Aggregates (nicht required -> Default erlaubt)
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createIntegerAttribute.bind(databases),
      "imageCount",
      false,
      0
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createBooleanAttribute.bind(databases),
      "hasImages",
      false,
      false
    )
  );

  // Meta
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createEnumAttribute.bind(databases),
      "status",
      ["eingegangen", "in-bearbeitung", "fertiggestellt", "abgeholt"],
      true
    )
  );

  // Wenn neue Attribute angelegt wurden -> warten bis available
  if (createdFlags.some(Boolean)) {
    await waitForAttributes(colId, [
      "customerNumber",
      "year",
      "firstName",
      "lastName",
      "fullName",
      "street",
      "houseNumber",
      "zipCode",
      "city",
      "fullAddress",
      "email",
      "phone",
      "imageCount",
      "hasImages",
      "status",
    ]);
    // frische Listen holen
    attrs = (await databases.listAttributes(dbId, colId)).attributes;
    idxs = (await databases.listIndexes(dbId, colId)).indexes;
  }

  // Indizes (auf vorhandene Felder & Systemzeit)
  await ensureIndex(
    colId,
    idxs,
    "uniq_customerNumber",
    "unique",
    ["customerNumber"],
    ["asc"]
  );
  await ensureIndex(
    colId,
    idxs,
    "by_fullName",
    "fulltext",
    ["fullName"],
    ["asc"]
  );
  await ensureIndex(colId, idxs, "by_status", "key", ["status"], ["asc"]);
  await ensureIndex(colId, idxs, "by_year", "key", ["year"], ["asc"]);
  await ensureIndex(
    colId,
    idxs,
    "by_createdAt",
    "key",
    ["$createdAt"],
    ["desc"]
  ); // Systemfeld
}

/* --------------- customerFiles --------------- */

async function setupCustomerFiles() {
  const colId = FILES;
  await ensureCollection(colId, "CustomerFiles");

  let attrs = (await databases.listAttributes(dbId, colId)).attributes;
  let idxs = (await databases.listIndexes(dbId, colId)).indexes;

  let hasRelation = false;
  let createdRel = false;

  try {
    createdRel = await ensureAttr(
      colId,
      attrs,
      databases.createRelationshipAttribute.bind(databases),
      "customer",
      dbId,
      CUST,
      "oneToOne",
      false
    );
    hasRelation = true;
  } catch {
    console.log("  ℹ️ relationship not supported – using customerId:string");
  }

  const createdFlags = [];

  if (!hasRelation) {
    createdFlags.push(
      await ensureAttr(
        colId,
        attrs,
        databases.createStringAttribute.bind(databases),
        "customerId",
        64,
        true
      )
    );
  }

  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "bucketId",
      64,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "fileId",
      64,
      true
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createEnumAttribute.bind(databases),
      "purpose",
      ["rim", "invoice", "profile", "other"],
      false
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createIntegerAttribute.bind(databases),
      "order",
      false,
      0
    )
  );
  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "notes",
      1000,
      false
    )
  );

  if (createdRel || createdFlags.some(Boolean)) {
    const waitKeys = ["bucketId", "fileId", "purpose", "order", "notes"];
    if (hasRelation) waitKeys.push("customer");
    else waitKeys.push("customerId");
    await waitForAttributes(colId, waitKeys);
    attrs = (await databases.listAttributes(dbId, colId)).attributes;
    idxs = (await databases.listIndexes(dbId, colId)).indexes;
  }

  if (!hasRelation) {
    await ensureIndex(
      colId,
      idxs,
      "by_customerId",
      "key",
      ["customerId"],
      ["asc"]
    );
  } else {
    await ensureIndex(colId, idxs, "by_customer", "key", ["customer"], ["asc"]);
  }
  await ensureIndex(
    colId,
    idxs,
    "by_createdAt",
    "key",
    ["$createdAt"],
    ["desc"]
  );
}

/* --------------- customerServices --------------- */

async function setupCustomerServices() {
  const colId = SERV;
  await ensureCollection(colId, "CustomerServices");

  let attrs = (await databases.listAttributes(dbId, colId)).attributes;
  let idxs = (await databases.listIndexes(dbId, colId)).indexes;

  let hasRelation = false;
  let createdRel = false;

  try {
    createdRel = await ensureAttr(
      colId,
      attrs,
      databases.createRelationshipAttribute.bind(databases),
      "customer",
      dbId,
      CUST,
      "oneToOne",
      false
    );
    hasRelation = true;
  } catch {
    console.log("  ℹ️ relationship not supported – using customerId:string");
  }

  const createdFlags = [];
  if (!hasRelation) {
    createdFlags.push(
      await ensureAttr(
        colId,
        attrs,
        databases.createStringAttribute.bind(databases),
        "customerId",
        64,
        true
      )
    );
  }

  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createEnumAttribute.bind(databases),
      "serviceType",
      ["rims", "tires-purchase", "tire-service"],
      true
    )
  );

  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createStringAttribute.bind(databases),
      "data",
      8000,
      false
    )
  );

  createdFlags.push(
    await ensureAttr(
      colId,
      attrs,
      databases.createEnumAttribute.bind(databases),
      "status",
      ["offen", "in-bearbeitung", "fertig", "storniert"],
      false
    )
  );

  if (createdRel || createdFlags.some(Boolean)) {
    const waitKeys = ["serviceType", "data", "status"];
    if (hasRelation) waitKeys.push("customer");
    else waitKeys.push("customerId");
    await waitForAttributes(colId, waitKeys);
    attrs = (await databases.listAttributes(dbId, colId)).attributes;
    idxs = (await databases.listIndexes(dbId, colId)).indexes;
  }

  if (!hasRelation) {
    await ensureIndex(
      colId,
      idxs,
      "by_customerId",
      "key",
      ["customerId"],
      ["asc"]
    );
  } else {
    await ensureIndex(colId, idxs, "by_customer", "key", ["customer"], ["asc"]);
  }
  await ensureIndex(
    colId,
    idxs,
    "by_serviceType",
    "key",
    ["serviceType"],
    ["asc"]
  );
  await ensureIndex(
    colId,
    idxs,
    "by_createdAt",
    "key",
    ["$createdAt"],
    ["desc"]
  );
}

/* --------------- counters --------------- */

async function setupCounters() {
  const colId = CNTR;
  await ensureCollection(colId, "Counters");

  let attrs = (await databases.listAttributes(dbId, colId)).attributes;
  let idxs = (await databases.listIndexes(dbId, colId)).indexes;

  const createdA = await ensureAttr(
    colId,
    attrs,
    databases.createStringAttribute.bind(databases),
    "scope",
    64,
    true
  );
  const createdB = await ensureAttr(
    colId,
    attrs,
    databases.createIntegerAttribute.bind(databases),
    "last",
    true,
    0
  );

  if (createdA || createdB) {
    await waitForAttributes(colId, ["scope", "last"]);
    idxs = (await databases.listIndexes(dbId, colId)).indexes;
  }

  await ensureIndex(colId, idxs, "uniq_scope", "unique", ["scope"], ["asc"]);
}

/* ---------------- Run ---------------- */

(async () => {
  await setupCustomers();
  await setupCustomerFiles();
  await setupCustomerServices();
  await setupCounters();
  console.log("✅ Compact Pro Setup done (with attribute availability wait).");
})();
