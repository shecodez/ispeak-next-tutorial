import Link from "next/link";
import ReactMarkdown from "react-markdown";

// UI component for main dialogue content
export default function DialoguePost({ dialogue }) {
  const createdAt =
    typeof dialogue?.createdAt === "number"
      ? new Date(dialogue.createdAt)
      : dialogue.createdAt.toDate();

  return (
    <div className="card">
      <h1>{dialogue?.title}</h1>
      <span className="text-sm">
        Written by{" "}
        <Link href={`/${dialogue.username}/`}>
          <a className="text-info">@{dialogue.username}</a>
        </Link>{" "}
        on {createdAt.toISOString()}
      </span>

      <ReactMarkdown>{dialogue?.description}</ReactMarkdown>
    </div>
  );
}
