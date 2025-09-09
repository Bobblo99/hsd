// @ts-nocheck
const { sdk, databases, dbId } = require("./index");

const CUST = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2; // "customers"
const SERV = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_SERVICES; // "customerServices"
const FILES = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_FILES; // "customerFiles"
const CNTR = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_COUNTERS; // "counters"

const { Query, ID } = sdk;

// create next customer number (with counter collection)
async function nextCustomerNumber(year = new Date().getFullYear()) {
  const scope = `customers-${year}`;

  // read counter
  const found = await databases.listDocuments(dbId, CNTR, [
    Query.equal("scope", scope),
  ]);
  let current = 0;
  let counterDoc = found.total ? found.documents[0] : null;

  if (!counterDoc) {
    // create new counter
    counterDoc = await databases.createDocument(dbId, CNTR, ID.unique(), {
      scope,
      last: 1,
    });
    current = 1;
  } else {
    current = (counterDoc.last || 0) + 1;
    counterDoc = await databases.updateDocument(dbId, CNTR, counterDoc.$id, {
      last: current,
    });
  }

  // customer number format
  const num = String(current).padStart(6, "0");
  return { number: `C-${year}-${num}`, year };
}

async function createServiceForCustomer(customerId, payload) {
  try {
    return await databases.createDocument(dbId, SERV, ID.unique(), {
      ...payload,
      customer: customerId,
    });
  } catch (e) {
    // relation for customer not working? try customerId field instead
    if (
      e?.type === "document_invalid_structure" ||
      /Unknown attribute: "customer"/i.test(
        String(e?.response?.message || e?.message)
      )
    ) {
      return await databases.createDocument(dbId, SERV, ID.unique(), {
        ...payload,
        customerId,
      });
    }
    throw e;
  }
}

// helper file record
async function createFileRecordForCustomer(
  customerId,
  { bucketId, fileId, ...rest }
) {
  try {
    return await databases.createDocument(dbId, FILES, ID.unique(), {
      customer: customerId,
      bucketId,
      fileId,
      ...rest,
    });
  } catch (e) {
    if (
      e?.type === "document_invalid_structure" ||
      /Unknown attribute: "customer"/i.test(
        String(e?.response?.message || e?.message)
      )
    ) {
      return await databases.createDocument(dbId, FILES, ID.unique(), {
        customerId,
        bucketId,
        fileId,
        ...rest,
      });
    }
    throw e;
  }
}

async function insertCustomer() {
  try {
    // get customer number
    const { number: customerNumber, year } = await nextCustomerNumber(2025);

    // create customer document
    const customer = await databases.createDocument(dbId, CUST, ID.unique(), {
      customerNumber,
      year,
      firstName: "Max",
      lastName: "Mustermann",
      fullName: "Max Mustermann",
      street: "Musterstraße",
      houseNumber: "12a",
      zipCode: "12345",
      city: "Musterstadt",
      fullAddress: "Musterstraße 12a, 12345 Musterstadt",
      email: "max@example.com",
      phone: "01234 56789",

      // aggregates
      imageCount: 0,
      hasImages: false,

      // status
      status: "eingegangen",
    });

    console.log("✅ Customer erstellt:", customer.$id, customer.customerNumber);

    // 3) example service
    const rimsService = await createServiceForCustomer(customer.$id, {
      serviceType: "rims",
      status: "offen",
      data: JSON.stringify({
        rimsCount: "4",
        rimsHasBent: "ja",
        rimsFinish: "einfarbig",
        rimsColor: "schwarz-glanz",
        rimsSticker: "audi-sport",
        notes: "Testanlage über Script",
      }),
    });

    console.log(
      "✅ Service erstellt:",
      rimsService.$id,
      rimsService.serviceType
    );

    // example file record
    const fileRecord = await createFileRecordForCustomer(customer.$id, {
      bucketId: "your_bucket_id_here",
      fileId: "dummy-file-id", // replace with actual file ID if available
      purpose: "rim",
      order: 1,
      notes: "Platzhalter-Datei",
    });

    console.log("✅ File-Record erstellt:", fileRecord.$id);

    console.log("🎉 Fertig.");
  } catch (err) {
    console.error("❌ Fehler beim Erstellen:", err);
  }
}

insertCustomer();
