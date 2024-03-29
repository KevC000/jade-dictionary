
import { DocumentReference, DocumentSnapshot, Firestore, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { WordList } from "../../types/word-list";
import { SortOption } from "../../types/dictionary";


export const createWordList = async (userUid: string, db: Firestore, title: string, description: string): Promise<void> => {
  try {
    const newWordList = {
      title,
      description,
      wordIds: [],
      userUid,
      createdAt: serverTimestamp(),
      lastUpdatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "wordLists"), newWordList);

    await updateDoc(docRef, { id: docRef.id });

    console.log("Word list created successfully with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating word list: ", error);
  }
};

export const addWordToWordList = async (db: Firestore, wordListRef: DocumentReference, wordId: number): Promise<void> => {
  try {
    const wordListSnapshot = await getDoc(wordListRef);

    if (!wordListSnapshot.exists()) {
      throw new Error("Word list not found");
    }

    const wordListData = wordListSnapshot.data() as WordList;
    if (wordListData.wordIds.includes(wordId)) {
      throw new Error("Word already exists in the word list");
    }

    await updateDoc(wordListRef, {
      wordIds: arrayUnion(wordId)
    });

    console.log("Word added to the word list successfully");
  } catch (error) {
    console.error("Error adding word to word list: ", error);
    throw error; 
  }
};

export const removeWordFromWordList = async (db: Firestore, wordListRef: DocumentReference, wordId: number): Promise<void> => {
  try {
    await updateDoc(wordListRef, {
      wordIds: arrayRemove(wordId)
    });

    console.log("Word removed from the word list successfully");
  } catch (error) {
    console.error("Error removing word from word list: ", error);
    throw error;
  }
};

export const editWordList = async (wordListRef: DocumentReference, newTitle?: string, newDescription?: string): Promise<void> => {
  try {
    const updateData: Partial<WordList> = {};
    if (newTitle !== undefined) updateData.title = newTitle;
    if (newDescription !== undefined) updateData.description = newDescription;
    updateData.lastUpdatedAt = serverTimestamp(); // Update lastUpdatedAt

    await updateDoc(wordListRef, updateData);
    console.log("Word list updated successfully");
  } catch (error) {
    console.error("Error updating word list: ", error);
    throw error;
  }
};

export const getUserWordLists = async (
  db: Firestore,
  userUid: string,
  sortOption: SortOption = SortOption.Recent// default sort option
): Promise<WordList[]> => {
  try {
    let q;

    switch (sortOption) {
      case SortOption.Recent:
        q = query(collection(db, "wordLists"), where("userUid", "==", userUid), orderBy("lastUpdatedAt", "desc"));
        break;
      case SortOption.Oldest:
        q = query(collection(db, "wordLists"), where("userUid", "==", userUid), orderBy("lastUpdatedAt", "asc"));
        break;
      case SortOption.Alphabetical:
        q = query(collection(db, "wordLists"), where("userUid", "==", userUid), orderBy("title", "asc"));
        break;
      case SortOption.ReverseAlphabetical:
        q = query(collection(db, "wordLists"), where("userUid", "==", userUid), orderBy("title", "desc"));
        break;
      default:
        q = query(collection(db, "wordLists"), where("userUid", "==", userUid));
    }


    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as WordList;
      return { ...data, id: doc.id }; // Include the document ID
    });
  } catch (error) {
    console.error("Error fetching user's word lists: ", error);
    throw error;
  }
};

export const getWordListByDocId = async (db: Firestore, docId: string): Promise<WordList | null> => {

  const collectionName: string = "wordLists"

  try {
    const wordListRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(wordListRef);

    if (docSnap.exists()) {
      return docSnap.data() as WordList;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting word list: ", error);
    throw error;
  }
};

export const deleteWordList = async (db: Firestore, wordListId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "wordLists", wordListId));
    console.log("Word list deleted successfully");
  } catch (error) {
    console.error("Error deleting word list: ", error);
    throw error;
  }
};


export const removeWordFromList = async (db: Firestore, wordListId:string, wordId:number) => {
  const wordListRef = doc(db, "wordLists", wordListId);

  try {
    await updateDoc(wordListRef, {
      wordIds: arrayRemove(wordId)
    });

    console.log("Word removed from the word list successfully");
  } catch (error) {
    console.error("Error removing word from word list: ", error);
    throw error;
  }
};