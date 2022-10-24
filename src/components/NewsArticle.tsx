import Image from "next/image";
import { NewsArticleImage } from "../pages/news";
import parse from "html-react-parser";

import styles from "./NewsArticle.module.scss";

interface NewsArticleProps {
  title: string;
  image: NewsArticleImage;
  content: string;
}

const bold = '<span style="font-weight: bold;">';

function getStyle(thing: any) {
  console.log(thing);
  return bold;
}

export default function NewsArticle({
  title,
  image,
  content,
}: NewsArticleProps) {
  content = content.replace(/<align=".*?">(.*?)<\/align>/g, `$1`);
  content = content.replace(/<style="(.*?)">/g, getStyle(`$1`));
  content = content.replace(/<\/style>/g, "<span>");
  content = content.replace(/<\/link>/g, "</a>");
  content = content.replace(/<color=(#.{6})>/g, `<span style="color: $1;>`);
  content = content.replace(/<link=".*?">/g, "<a>");

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
