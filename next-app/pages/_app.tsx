import "tailwindcss/tailwind.css";
import "../styles/global.css";

import { Toaster } from "react-hot-toast";

import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import useUserData from "../lib/use/userData";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
