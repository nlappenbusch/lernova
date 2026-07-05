import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Rendert Markdown-Notizen (Session-Protokolle der Tutor:innen).
 * Styles via .prose-notes in globals.css. Kein HTML-Passthrough (XSS-sicher).
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-notes">
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
        {children}
      </ReactMarkdown>
    </div>
  );
}
