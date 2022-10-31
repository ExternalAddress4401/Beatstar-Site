import NewsArticle from "../components/NewsArticle";
import { readCmsFile } from "../utils/readCmsFile";

import styles from "./news.module.scss";

export interface NewsArticleImage {
  id: string;
  url: string;
  width: number;
  height: number;
  rect: {
    width: number;
    height: number;
  };
}

export interface NewsProps {
  news: {
    type: number;
    piece: {
      html: string;
      strings: string[];
    };
    id: number;
    viewType: "Text";
    timestamp1: number;
    timestamp2: number;
    popup: boolean;
    order: number;
    images: NewsArticleImage;
    title: string;
    status: number;
  }[];
  version: string;
  nextStoryId: number;
}

export default function news(news: NewsProps) {
  return (
    <div className={styles.content}>
      {news.news.map((el) => (
        <NewsArticle
          title={el.title}
          image={el.images}
          content={el.piece.html}
        />
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const news = await readCmsFile("NewsFeed");

  return {
    props: {
      news: news.news,
    },
  };
}
