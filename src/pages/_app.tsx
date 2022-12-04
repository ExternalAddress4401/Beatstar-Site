import Navigation from "../components/Navigation";
import "../styles/globals.css";
import "@fontsource/nunito";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
