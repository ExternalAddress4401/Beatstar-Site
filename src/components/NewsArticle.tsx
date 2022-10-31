import Image from "next/image";
import { NewsArticleImage } from "../pages/news";
import parse from "html-react-parser";

import styles from "./NewsArticle.module.scss";

interface NewsArticleProps {
  title: string;
  image: NewsArticleImage;
  content: string;
}

export default function NewsArticle({
  title,
  image,
  content,
}: NewsArticleProps) {
  content = content.replace(/<align=".*?">(.*?)<\/align>/g, `$1`);
  content = content.replace(/<\/style>/g, "</span>");
  content = content.replace(/<\/color>/g, "</span>");
  content = content.replace(/<\/link>/g, "</a>");
  content = content.replace(/<color=(#.{6})>/g, `<span style="color: $1;>`);
  content = content.replace(/<link=".*?">/g, "<a>");

  //content = content.replace(
  //  ,
  //  `<span className=${`$1` === "Bold" ? bold : italic}>`
  //);

  let match;
  while ((match = /<style="(.*?)">/g.exec(content))) {
    console.log(match[1]);
    content = content.replace(
      /<style="(.*?)">/,
      `<span className=${styles[match[1]]}>`
    );
  }

  console.log(parse(content));
  console.log(content);

  content = `<span className=NewsArticle_H2__0_d9o><span className=NewsArticle_Bold__ZUMTO><span style="color: #f4be4e;><span className=NewsArticle_Link__X_nUb><a>WATCH TRAILER!</a></span></span></span></span>

  Discover Country music in Beatstar! Introducing a NEW GENRE with your favourite Country artists.
  
  Collect songs by <span className=NewsArticle_Bold__ZUMTO>Dolly Parton</span>, <span className=NewsArticle_Bold__ZUMTO>Luke Bryan</span>, <span className=NewsArticle_Bold__ZUMTO>Dan + Shay</span>, <span className=NewsArticle_Bold__ZUMTO>Bailey Zimmerman</span>, <span className=NewsArticle_Bold__ZUMTO>Luke Combs</span> and more coming throughout November! 
  
  We're also updating the Journey with two new levels and <span className=NewsArticle_Bold__ZUMTO>adding over 40 songs to collect!</span>
  
  <span className=NewsArticle_Bold__ZUMTO><span style="color: #1892ed;><span className=NewsArticle_Link__X_nUb><a>TAP HERE TO LEARN MORE!</a></span></span></span>`;

  //console.log(content);
  //content = content.replace(regex, `$1`);
  //style="Bold"
  //style="Italic"
  //style="H1"
  //color=""
  //style="Link"
  //link=
  return (
    <div className={styles.article}>
      <h2>{title}</h2>
      <div className={styles.content}>
        <Image src={image.url} width={image.width} height={image.height} />
        <p>{parse(content)}</p>
      </div>
    </div>
  );
}
