import { type NextPage } from "next";

const Home: NextPage = () => {
  return null;
};

export default Home;

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: "/code",
      permanent: false,
    },
  };
};
