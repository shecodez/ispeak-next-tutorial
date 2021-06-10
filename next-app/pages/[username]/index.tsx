import { getUserWithUsername, docToJSON } from "../../lib/firebase";
import DialogueFeed from "../../components/DialogueFeed";
import Metatags from "../../components/Metatags";
import UserProfile from "../../components/UserProfile";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let dialogues = null;

  if (userDoc) {
    user = userDoc.data();
    const dialoguesQuery = userDoc.ref
      .collection("dialogues")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5);
    dialogues = (await dialoguesQuery.get()).docs.map(docToJSON);
  }

  return {
    props: { user, dialogues }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, dialogues }) {
  return (
    <main>
      <Metatags
        title={user.username}
        description={`${user.username}'s public profile`}
      />
      <UserProfile user={user} />
      <DialogueFeed dialogues={dialogues} admin />
    </main>
  );
}
