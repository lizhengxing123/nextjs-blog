import React from "react";
import ReactMarkdown from "react-markdown";
import MarkdownNavbar from "markdown-navbar";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "./markdown-styles.module.css";
import "markdown-navbar/dist/navbar.css";

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
      <MarkdownNavbar
        className="authorList"
        source={content}
        declarative={true}
        ordered={false}
      />
      <ReactMarkdown
        className={`${styles.markdown} text-lg max-w-prose mt-6 prose prose-dark prose-lg text-gray-300 mx-auto`}
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          code,
        }}
      />
    </>
  );
}
