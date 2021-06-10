import Link from "next/link";
import toast from "react-hot-toast";

import Loader from "../components/Loader";

export default function HomePage() {
  return (
    <div>
      <Link
        prefetch={false}
        href={{
          pathname: "/[username]",
          query: { username: "shecodez" },
        }}
      >
        <a>Niico's profile</a>
      </Link>
      <Loader show />
      <button onClick={() => toast.success("Hello toast!")}>Toast Me</button>
    </div>
  );
}
