import Navigation from "../components/Navigation";
import "../styles/globals.css";
import "@fontsource/nunito";

import styles from "./app.module.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navigation />
      <div className={styles.layout}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
