import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import DialogueFeed from "../../components/DialogueFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

export default function AdminDialogueListPage({}) {
  return (
    <main>
      <AuthCheck>
        <DialogueList />
        <CreateNewDialogue />
      </AuthCheck>
    </main>
  );
}

function DialogueList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("dialogues");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const dialogues = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Dialogues</h1>
      <DialogueFeed dialogues={dialogues} admin />
    </>
  );
}

function CreateNewDialogue() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new dialogue in firestore
  const createDialogue = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("dialogues")
      .doc(slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      description: "# hello world!",
      speakers: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success("Dialogue created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createDialogue}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Dialogue!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Dialogue
      </button>
    </form>
  );
}
