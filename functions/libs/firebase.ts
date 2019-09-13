import firebase from './db';
import { CallbackInterface, SuccessResponse, ErrorResponse } from './http-responses';

export default class Firestore {
  db;
  dbCollection;

  constructor() {
    this.db = firebase.firestore();
  }

  setCollection = (collection: string) => this.db.collection(collection);

  get = (collection: string): CallbackInterface | Promise<CallbackInterface> => {
    try {
      return this.setCollection(collection)
        .get()
        .then(
          (snapshot) => {
            if (snapshot.empty) {
              return SuccessResponse(null);
            }
            let collection: Array<any> = [];
            snapshot.forEach(doc => {
              collection.push(doc.data());
            });
            return SuccessResponse(JSON.stringify(collection));
          },
          (error) => { return ErrorResponse(error.message); },
          // (rejected) => { return ErrorResponse(rejected.message); },
        )
        .catch((error) => { return ErrorResponse(error.message); });
    }
    catch(error) {
      return ErrorResponse(error.message);
    }
  };

  setBatch = (items: Array<any>, key: string = 'id', subCollection?: string, doc?: string) => {
    try {
      const batch = this.db.batch();
      let ref;
      if (doc) {
        ref = this.dbCollection.doc(doc);
      }

      // console.log('items: ', items);
    
      items.map((item) => {
        ref = (!doc ? this.dbCollection.doc(item[key]) : ref);
        ref = (subCollection ? ref.collection(subCollection).doc(item[key]) : ref);
        batch.set(ref, item, {merge: true});
      });

      return batch.commit()
        .then(
          (success) => { return SuccessResponse(JSON.stringify(items)); },
          // (rejected) => { return ErrorResponse(rejected.message); },
        )
        .catch(
          (error) => { return ErrorResponse(error.message); },
        );
      // return SuccessResponse(JSON.stringify(items));
    }
    catch(error) {
      return ErrorResponse(JSON.stringify(error.message));
    }
  }

  set = (collection: string, items: Array<any> | any) => {
    try {
      let newItems = items;
      if (!Array.isArray(items)) {
        newItems = [...items];
      }
      this.dbCollection = this.setCollection(collection);
      return this.setBatch(newItems)
        .catch((error) => ErrorResponse(error.message))
      ;
    }
    catch(error) {
      return ErrorResponse(error.message);
    }
  }
}
