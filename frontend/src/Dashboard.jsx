import {
  FileText,
  LogOut,
  MessageSquare,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import "./Dashboard.css";

function Dashboard({ username, onLogout, onStartAsking }) {
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const [documents, setDocuments] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState(null);

  const getToken = () => {
    return (
      sessionStorage.getItem("knovexa_access") ||
      localStorage.getItem("knovexa_access")
    );
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadMessage("Please select a PDF file.");
      e.target.value = "";
      return;
    }

    const token = getToken();

    if (!token) {
      setUploadMessage(
        "Your session has expired. Please sign in again."
      );
      e.target.value = "";
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", file.name);

    setUploading(true);
    setUploadMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/documents/upload/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUploadMessage("Upload failed. Please try again.");
        return;
      }

      setUploadMessage(
        `"${file.name}" uploaded successfully.`
      );

      console.log("Uploaded document:", data);

      if (showDocuments) {
        fetchDocuments();
      }
    } catch (error) {
      console.error("Upload error:", error);

      setUploadMessage(
        "Unable to connect to the server. Make sure Django is running."
      );
    } finally {
      setUploading(false);
    }

    e.target.value = "";
  };

  const fetchDocuments = async () => {
    const token = getToken();

    setShowDocuments(true);
    setLoadingDocuments(true);

    if (!token) {
      setLoadingDocuments(false);
      setDocuments([]);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/documents/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Documents API response:", data);

      if (!response.ok) {
        console.error(
          "Document fetch failed:",
          data
        );

        setDocuments([]);
        return;
      }

      setDocuments(data);
    } catch (error) {
      console.error(
        "Document fetch error:",
        error
      );

      setDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleViewDocuments = () => {
    if (showDocuments) {
      setShowDocuments(false);
      return;
    }

    fetchDocuments();
  };

  const handleDelete = async (documentId) => {
    const token = getToken();

    if (!token) {
      alert(
        "Your session has expired. Please sign in again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingDocumentId(documentId);

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/api/documents/${documentId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
          "Unable to delete this document."
        );
        return;
      }

      setDocuments((prevDocuments) =>
        prevDocuments.filter(
          (document) =>
            document.id !== documentId
        )
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  return (
    <main className="dashboard">

      <header className="dashboard-header">

        <div className="dashboard-brand">

          <div className="dashboard-logo">
            <span></span>
            <span></span>
          </div>

          <span>Knovexa</span>

        </div>

        <div className="dashboard-user">

          <div className="user-avatar">
            <User size={18} />
          </div>

          <span>{username}</span>

          <button
            type="button"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>

        </div>

      </header>

      <section className="dashboard-content">

        <div className="dashboard-intro">

          <p className="dashboard-eyebrow">
            KNOWLEDGE COMPANION
          </p>

          <h1>
            Welcome back, <span>{username}</span>.
          </h1>

          <p>
            Upload your documents and start exploring
            your knowledge with Knovexa.
          </p>

        </div>

        <div className="dashboard-cards">

          {/* Upload Documents */}

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              <Upload size={24} />
            </div>

            <h2>
              Upload documents
            </h2>

            <p>
              Add PDFs and other company documents
              to your knowledge base.
            </p>

            <input
              type="file"
              id="pdf-upload"
              accept=".pdf,application/pdf"
              style={{
                display: "none",
              }}
              onChange={handleUpload}
              disabled={uploading}
            />

            <label
              htmlFor="pdf-upload"
              className="dashboard-upload-button"
              style={{
                opacity: uploading ? 0.7 : 1,
                pointerEvents: uploading
                  ? "none"
                  : "auto",
              }}
            >
              <Upload size={17} />

              {uploading
                ? "Uploading..."
                : "Upload PDF"}
            </label>

            {uploadMessage && (
              <p
                style={{
                  marginTop: "14px",
                  marginBottom: "0",
                  minHeight: "auto",
                  fontSize: "12px",
                  color:
                    uploadMessage.includes(
                      "successfully"
                    )
                      ? "#24613e"
                      : "#b33a32",
                  flex: "none",
                }}
              >
                {uploadMessage}
              </p>
            )}

          </div>

          {/* Ask Knovexa */}

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              <MessageSquare size={24} />
            </div>

            <h2>
              Ask Knovexa
            </h2>

            <p>
              Ask questions and get answers directly
              from your uploaded documents.
            </p>

            <button
              type="button"
              onClick={onStartAsking}
            >
              <MessageSquare size={17} />
              Start asking
            </button>

          </div>

          {/* Your Documents */}

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              <FileText size={24} />
            </div>

            <h2>
              Your documents
            </h2>

            <p>
              View and manage the documents available
              in your Knovexa knowledge base.
            </p>

            <button
              type="button"
              onClick={handleViewDocuments}
              disabled={loadingDocuments}
            >
              <FileText size={17} />

              {loadingDocuments
                ? "Loading..."
                : showDocuments
                ? "Hide documents"
                : "View documents"}
            </button>

          </div>

        </div>

        {showDocuments && (

          <div className="documents-section">

            <div className="documents-section-header">

              <div>
                <h2>Your documents</h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDocuments(false)
                }
              >
                Hide
              </button>

            </div>

            {loadingDocuments ? (

              <div className="documents-empty">
                Loading documents...
              </div>

            ) : documents.length === 0 ? (

              <div className="documents-empty">
                No documents uploaded yet.
              </div>

            ) : (

              <div className="documents-list">

                {documents.map((document) => (

                  <div
                    className="document-item"
                    key={document.id}
                  >

                    <div className="document-item-icon">
                      <FileText size={20} />
                    </div>

                    <div className="document-item-info">

                      <h3>
                        {document.title}
                      </h3>

                      <p>
                        Uploaded{" "}
                        {new Date(
                          document.uploaded_at
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    <button
                      type="button"
                      className="document-delete-button"
                      onClick={() =>
                        handleDelete(document.id)
                      }
                      disabled={
                        deletingDocumentId ===
                        document.id
                      }
                      title="Delete document"
                    >
                      <Trash2 size={17} />

                      {deletingDocumentId ===
                      document.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default Dashboard;