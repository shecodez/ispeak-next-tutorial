import Link from "next/link";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";
import ImageUploader from "../../components/ImageUploader";

export default function AdminDialogueEditPage({}) {
  return (
    <AuthCheck>
      <DialogueManager />
    </AuthCheck>
  );
}

export type Dialogue = {
  title: string;
  slug: string;
  description: string;
  speakers: [];
  published: boolean;
  username: string;
  heartCount: number;
  uid: string;
  createdAt: string; // datetime?
  updatedAt: string; // datetime?
};

function DialogueManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const dialogueRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("dialogues")
    .doc(slug);
  const [dialogue] = useDocumentDataOnce(dialogueRef);

  return (
    <main className={styles.container}>
      {dialogue && (
        <>
          <section>
            <h1>{dialogue.title}</h1>
            <p>ID: {dialogue.slug}</p>

            <DialogueForm
              dialogueRef={dialogueRef}
              defaultValues={dialogue}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${dialogue.username}/${dialogue.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeleteDialogueButton dialogueRef={dialogueRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function DialogueForm({ defaultValues, dialogueRef, preview }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const updateDialogue = async ({ description, published }) => {
    await dialogueRef.update({
      description,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ description, published });

    toast.success("Dialogue updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updateDialogue)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("description")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          name="description"
          ref={register({
            maxLength: { value: 2000, message: "description is too long" },
            minLength: { value: 3, message: "description is too short" },
            required: { value: true, message: "description is required" },
          })}
        ></textarea>

        {errors.description && (
          <p className="text-danger">{errors.description.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            ref={register}
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeleteDialogueButton({ dialogueRef }) {
  const router = useRouter();

  const deleteDialogue = async () => {
    const doIt = confirm("are you sure!");
    if (doIt) {
      await dialogueRef.delete();
      router.push("/admin");
      toast("dialogue annihilated ", { icon: "🗑️" });
    }
  };

  return (
    <button className="btn-red" onClick={deleteDialogue}>
      Delete
    </button>
  );
}
