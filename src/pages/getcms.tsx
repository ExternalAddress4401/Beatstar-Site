import { CMSRequester } from "@externaladdress4401/protobuf";

interface getcmsprops {
  cms: string[];
}

export default function getcms({ cms }: getcmsprops) {
  return (
    <div>
      {cms.map((el) => (
        <div key={el}>
          <div>{el}</div>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const cms = (await CMSRequester.getCMS()).map((el) => el.url);

  return {
    props: {
      cms,
    },
  };
}
