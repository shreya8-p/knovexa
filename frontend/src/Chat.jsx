import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Send,
} from "lucide-react";
import { useState } from "react";
import "./Chat.css";

function Chat({ username, onBack }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return (
      sessionStorage.getItem("knovexa_access") ||
      localStorage.getItem("knovexa_access")
    );
  };

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        type: "question",
        text: currentQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    const token = getToken();

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: "Your session has expired. Please sign in again.",
        },
      ]);

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: currentQuestion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            type: "answer",
            text: "Something went wrong. Please try again.",
          },
        ]);

        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: "Unable to connect to Knovexa. Make sure Django is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="chat-page">
      <header className="chat-header">
        <button
          type="button"
          className="chat-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="chat-brand">
          <MessageSquare size={20} />
          <span>Knovexa</span>
        </div>

        <div className="chat-user">
          {username}
        </div>
      </header>

      <section className="chat-content">
        <div className="chat-intro">
          <p className="chat-eyebrow">
            KNOWLEDGE COMPANION
          </p>

          <h1>Ask Knovexa.</h1>

          <p>
            Ask questions about your uploaded documents
            and get answers with their sources.
          </p>
        </div>

        <div className="chat-box">

          <div className="messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <MessageSquare size={28} />

                <h2>What would you like to know?</h2>

                <p>
                  Ask something about your uploaded
                  company documents.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.type === "question"
                    ? "message-question"
                    : "message-answer"
                }`}
              >
                <div className="message-label">
                  {message.type === "question"
                    ? "You"
                    : "Knovexa"}
                </div>

                <div className="message-text">
                  {message.text}
                </div>

                {message.sources &&
                  message.sources.length > 0 && (
                    <div className="sources">
                      <p>Sources</p>

                      {message.sources.map(
                        (source, sourceIndex) => (
                          <div
                            className="source-item"
                            key={sourceIndex}
                          >
                            <FileText
                              size={15}
                            />

                            <span>
                              {source.document}
                              {" · "}
                              Page {source.page}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            ))}

            {loading && (
              <div className="message message-answer">
                <div className="message-label">
                  Knovexa
                </div>

                <div className="message-text">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form
            className="chat-input-area"
            onSubmit={handleAsk}
          >
            <input
              type="text"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Ask a question about your documents..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={
                loading || !question.trim()
              }
            >
              <Send size={18} />
            </button>
          </form>

        </div>
      </section>
    </main>
  );
}

export default Chat;