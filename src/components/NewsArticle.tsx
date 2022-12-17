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
  const stack = [];

  const matches = content.match(/<.*?>/g);
  for (const match of matches) {
    if (match.includes("</")) {
      content = content.replace(match, stack.pop());
    } else if (match.includes("<align")) {
      content = content.replace(match, '<span style="text-align: center">');
      stack.push("</span>");
    } else if (match.includes("Italic")) {
      content = content.replace(match, '<span style="font-style: italic">');
      stack.push("</span>");
    } else if (match.includes("Bold")) {
      content = content.replace(match, '<span style="font-weight: bold">');
      stack.push("</span>");
    } else if (match.includes("Link")) {
      content = content.replace(match, "");
      stack.push("");
    } else if (match.includes("color")) {
      content = content.replace(
        match,
        `<span style="color: ${match.slice(7, -1)}">`
      );
      stack.push("</span>");
    } else if (match.includes("link")) {
      content = content.replace(match, "");
      stack.push("</span>");
    } else if (match.includes("H1")) {
      content = content.replace(match, "<h1>");
      stack.push("</h1>");
    } else if (match.includes("H2")) {
      content = content.replace(match, "<h2>");
      stack.push("</h2>");
    }
  }

  content = content.replace(
    /\[sprite=10\]/g,
    `<img style="width: 20px; height: 20px" src='/images/extreme.png' />`
  );
  content = content.replace(
    /\[sprite=9\]/g,
    `<img style="width: 13px; height: 17px" src='/images/hard.png' />`
  );

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
