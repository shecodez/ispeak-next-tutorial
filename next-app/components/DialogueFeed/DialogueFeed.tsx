import Link from "next/link";

export default function DialogueFeed({ dialogues, admin }) {
  return dialogues
    ? dialogues.map((dialogue) => (
        <DialogueItem dialogue={dialogue} key={dialogue.slug} admin={admin} />
      ))
    : null;
}

function DialogueItem({ dialogue, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = dialogue?.description.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${dialogue.username}`}>
        <a>
          <strong>By @{dialogue.username}</strong>
        </a>
      </Link>

      <Link href={`/${dialogue.username}/${dialogue.slug}`}>
        <h2>
          <a>{dialogue.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💗 {dialogue.heartCount || 0} Hearts</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${dialogue.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {dialogue.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </>
      )}
    </div>
  );
}
