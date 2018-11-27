export const db = firebase.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);

export const storage = firebase.storage().ref()

export const PRODUCTS_COLLECTION = db.collection('products')