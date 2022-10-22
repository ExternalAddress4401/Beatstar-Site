// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="http://fonts.cdnfonts.com/css/kiona-2" rel="stylesheet" />
        <script
          src="https://kit.fontawesome.com/b1fc6d01cf.js"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
