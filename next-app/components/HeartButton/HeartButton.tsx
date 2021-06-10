import { useDocument } from "react-firebase-hooks/firestore";

import { firestore, auth, increment } from "../../lib/firebase";

// Allows user to heart or like a dialogue
export default function HeartButton({ dialogueRef }) {
  // Listen to heart document for currently logged in user
  const heartRef = dialogueRef.collection("hearts").doc(auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-dialogue relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(dialogueRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-dialogue relationship
  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(dialogueRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
