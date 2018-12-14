export const db = window.firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export const storage = window.firebase.storage().ref();

export const PRODUCTS_COLLECTION = db.collection("products");
