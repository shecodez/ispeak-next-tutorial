import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useContext } from "react";

import styles from "../../styles/Dialogue.module.css";
import AuthCheck from "../../components/AuthCheck";
import DialoguePost from "../../components/DialoguePost";
import HeartButton from "../../components/HeartButton";
import Metatags from "../../components/Metatags";
import { UserContext } from "../../lib/context";
import { firestore, getUserWithUsername, docToJSON } from "../../lib/firebase";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let dialogue;
  let path;

  if (userDoc) {
    const dialogueRef = userDoc.ref.collection("dialogues").doc(slug);
    dialogue = docToJSON(await dialogueRef.get());

    path = dialogueRef.path;
  }

  return {
    props: { dialogue, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  // TODO: Improve using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup("dialogues").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: "blocking",
  };
}

export default function ViewDialoguePage(props) {
  const dialogueRef = firestore.doc(props.path);
  const [realtimeDialogue] = useDocumentData(dialogueRef);

  const dialogue = realtimeDialogue || props.dialogue;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <Metatags title={dialogue.title} description={dialogue.title} />

      <section>
        <DialoguePost dialogue={dialogue} />
      </section>

      <aside className="card">
        <p>
          <strong>{dialogue.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton dialogueRef={dialogueRef} />
        </AuthCheck>

        {currentUser?.uid === dialogue.uid && (
          <Link href={`/admin/${dialogue.slug}`}>
            <button className="btn-blue">Edit Dialogue</button>
          </Link>
        )}
      </aside>
    </main>
  );
}
