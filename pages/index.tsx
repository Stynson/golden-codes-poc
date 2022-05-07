import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import html2canvas from "html2canvas";
import React, { useEffect, useRef, useState } from "react";
import "highlight.js/styles/a11y-dark.css";
import hljs from "highlight.js";

const Home: NextPage = () => {
  const toPrintRef = useRef<any>();
  const textareaRef = useRef<any>();
  const [url, setUrl] = useState("");
  const [input, setInput] = useState("");
  const [selectionPos, setSelectionPos] = useState(0);
  const [HLHTML, setHLHTML] = useState("");

  useEffect(() => {
    window.addEventListener("keyup", (e) => {
      if (e.key.startsWith("Arrow")) {
        setSelectionPos(textareaRef.current.selectionStart);
      }
    });
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.addEventListener("selectionchange", () =>
        console.log(textareaRef.current.selectionStart)
      );
    }
  }, [textareaRef.current]);

  useEffect(() => {
    const textWithCursor =
      input.slice(0, selectionPos) + "kissbalint" + input.slice(selectionPos);

    //    console.log(hljs.highlightAuto(textWithCursor));
    const highlighted = hljs.highlightAuto(textWithCursor);
    const cursorInserted = highlighted.value.replace(
      "kissbalint",
      "<span class='cursor'></span>"
    );
    setHLHTML(cursorInserted);
  }, [input, selectionPos]);

  const handleDownloadImage = async () => {
    const element = toPrintRef.current;
    if (element) {
      const canvas = await html2canvas(element, { logging: true });

      canvas.toBlob(async (blob) => {
        if (blob) {
          const foo = URL.createObjectURL(blob);
          setUrl(foo);
          const form = new FormData();
          form.append("file", blob);
          const { filename } = await (
            await fetch("/api/share", { method: "POST", body: form })
          ).json();
          window.location.pathname = `/view/${filename}`;
        }
      });
    }
  };
  return (
    <div className={styles.container}>
      {false && <img src={url}></img>}
      <button onClick={handleDownloadImage}>share</button>
      <div className={styles.overlapContainer}>
        <div className={styles.toPrintContainer} ref={toPrintRef}>
          <pre>
            <code
              className="hljs"
              dangerouslySetInnerHTML={{ __html: HLHTML }}
            ></code>
          </pre>
        </div>
        <textarea
          ref={textareaRef}
          value={input}
          onClick={(e) => {
            setSelectionPos(textareaRef.current.selectionStart);
          }}
          onChange={(e) => {
            setSelectionPos(e.target.selectionStart);
            setInput(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Home;
