import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }
  
  saveEpisodeData(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("episodes")
        .add(data)
        .then(resolve => {}, error => reject(error))
    });
  }

  getEpisodeData(){
    return this.firestore.collection("episodes").snapshotChanges();
  }
}
