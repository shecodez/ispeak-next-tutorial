import { useState } from "react";
import Link from "next/link";

import { firestore, fromMillis, docToJSON } from "../lib/firebase";
import DialogueFeed from "../components/DialogueFeed";
import Loader from "../components/Loader";
import Metatags from "../components/Metatags";

// Max dialogue to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
  const dialoguesQuery = firestore
    .collectionGroup("dialogues")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const dialogues = (await dialoguesQuery.get()).docs.map(docToJSON);

  return {
    props: { dialogues }, // will be passed to the page component as props
  };
}

export default function HomePage(props) {
  const [dialogues, setDialogues] = useState(props.dialogues);
  const [isLoading, setIsLoading] = useState(false);

  const [dialoguesEnd, setDialoguesEnd] = useState(false);

  // Get next page in pagination query
  const getMoreDialogues = async () => {
    setIsLoading(true);
    const last = dialogues[dialogues.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = firestore
      .collectionGroup("dialogues")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newDialogues = (await query.get()).docs.map((doc) => doc.data());

    setDialogues(dialogues.concat(newDialogues));
    setIsLoading(false);

    if (newDialogues.length < LIMIT) {
      setDialoguesEnd(true);
    }
  };

  return (
    <main>
      <Metatags
        title="Home Page"
        description="Get the latest dialogues on our site"
      />

      <div className="card card-info">
        <h2>🎙️ iSpeak</h2>
        <p>
          Welcome! This app is built with Next.js and Firebase and is loosely
          inspired by Dev.to.
        </p>
        <p>
          Sign up for an 🐱‍💻 account, ✍️ write dialogues, and 💗 like content
          created by other users. All public content is server-rendered and
          search-engine optimized.
        </p>
      </div>

      <DialogueFeed dialogues={dialogues} admin={false} />

      {!isLoading && !dialoguesEnd && (
        <button onClick={getMoreDialogues}>Load more</button>
      )}

      <Loader show={isLoading} />

      {dialoguesEnd && "You have reached the end!"}
    </main>
  );
}
