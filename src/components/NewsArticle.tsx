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
    content = content.replace(
      /<style="(.*?)">/,
      `<span className=${styles[match[1]]}>`
    );
  }
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
