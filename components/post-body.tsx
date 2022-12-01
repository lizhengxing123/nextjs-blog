import React from "react";
import ReactMarkdown from "react-markdown";
import MarkdownNavbar from "markdown-navbar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./markdown-styles.module.css";
import "markdown-navbar/dist/navbar.css";
import "./markdown-navigation.module.css";

// 代码片段
const code = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  return !inline && match ? (
    <SyntaxHighlighter
      children={String(children).replace(/\n$/, "")}
      language={match[1]}
      style={coldarkDark}
      PreTag="div"
      {...props}
    />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default function PostBody({ content }) {
  return (
    <>
      <div className="fixed left-0 top-0 w-40 h-full">
        <MarkdownNavbar
          className="authorList"
          source={content}
          declarative={true}
          ordered={false}
        />
      </div>
      <ReactMarkdown
        className={`${styles.markdown} text-lg max-w-prose mt-6 prose prose-dark prose-lg text-gray-300 mx-auto`}
        children={content}
        components={{
          code,
        }}
      />
    </>
  );
}
