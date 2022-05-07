import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import html2canvas from "html2canvas";
import React, { useRef } from "react";
import { useRouter } from "next/router";

const Home: NextPage = (props: any) => {
  const router = useRouter();
  const { id: routerId } = router.query;
  const { id } = props.params;

  return (
    <>
      <Head>
        <meta
          property="og:image"
          content={`https://gc-test-bucket.s3.eu-central-1.amazonaws.com/${id}`}
        />
      </Head>
      <div className={styles.container}>
        <img
          src={`https://gc-test-bucket.s3.eu-central-1.amazonaws.com/${id}`}
        />
      </div>
    </>
  );
};

export function getServerSideProps(context: any) {
  return {
    props: { params: context.params },
  };
}

export default Home;

//<meta property="og:url" content="http://gc.io" />
//<meta property="og:type" content="website" />
//<meta property="og:title" content="Code " />
//<meta property="og:description" content="Your code shared" />
