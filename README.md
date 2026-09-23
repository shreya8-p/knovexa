# 🚀 Knovexa

### AI-Powered Document Intelligence & RAG-Based Q&A

Knovexa is a full-stack document intelligence platform that lets users upload
company PDFs and ask natural-language questions about their contents.

It combines **Retrieval-Augmented Generation (RAG)**, **vector search**, and
**LLM-powered responses** to provide grounded answers with document and
page-level sources.

---

## ✨ Features

- 🔐 JWT Authentication
- 📄 PDF Upload & Processing
- 🧩 Automatic Text Chunking
- 🧠 Local Embeddings with `all-MiniLM-L6-v2`
- 🔎 Semantic Search with PostgreSQL + pgvector
- 💬 Conversational Document Q&A
- 🤖 Groq LLM Integration
- 📚 Document & Page-Level Sources
- ⚡ Automatic Embedding Generation
- 🗑️ Owner/Admin Document Deletion
- 🎨 React-Based Dashboard

---

## 🧠 How It Works

```text
PDF Upload
    ↓
Text Extraction
    ↓
Text Chunking
    ↓
Embedding Generation
    ↓
PostgreSQL + pgvector
    ↓
User Question
    ↓
Query Embedding
    ↓
Semantic Retrieval
    ↓
Relevant Document Chunks
    ↓
Groq LLM
    ↓
Grounded Answer + Sources

🛠️ Tech Stack
Frontend
React
Vite
JavaScript
CSS
Lucide React
Backend
Python
Django
Django REST Framework
Simple JWT
AI / RAG
Sentence Transformers
all-MiniLM-L6-v2
Groq
RAG
Database
PostgreSQL
pgvector
Infrastructure
Docker
Docker Compose

📂 Project Structure

knovexa/
│
├── backend/
│   ├── config/
│   ├── documents/
│   ├── services/
│   │   ├── embedding_service.py
│   │   ├── llm_service.py
│   │   ├── pdf_extractor.py
│   │   ├── rag_service.py
│   │   ├── retrieval_service.py
│   │   └── text_chunker.py
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── documents/
├── docker-compose.yml
├── .gitignore
└── README.md

⚙️ Local Setup
1. Clone the repository
git clone https://github.com/shreya8-p/knovexa.git
cd knovexa
2. Start PostgreSQL + pgvector
docker compose up -d
3. Setup the backend
cd backend

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt
4. Configure environment variables

Create:

backend/.env

Add:

GROQ_API_KEY=your_groq_api_key
5. Run migrations
python manage.py migrate
6. Start Django
python manage.py runserver 8001
7. Start the frontend

Open another terminal:

cd frontend
npm install
npm run dev
🔌 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register/	Register a user
POST	/api/auth/login/	Login and obtain JWT
POST	/api/auth/refresh/	Refresh JWT
POST	/api/documents/upload/	Upload a PDF
GET	/api/documents/	List documents
DELETE	/api/documents/<id>/delete/	Delete a document
POST	/api/chat/	Ask Knovexa a question
🔐 Document Access

All authenticated users can:

View uploaded company documents
Ask questions about the knowledge base

Document deletion is restricted to:

The user who uploaded the document
Administrators
🎯 RAG Pipeline

Knovexa processes documents automatically:

PDF text is extracted page by page.
Text is divided into overlapping chunks.
Each chunk is converted into a 384-dimensional embedding.
Embeddings are stored in PostgreSQL + pgvector.
User questions are converted into embeddings.
Relevant chunks are retrieved using semantic similarity.
Retrieved context is passed to the Groq LLM.
The generated response includes document and page sources.
🛡️ Grounded Responses

Knovexa is designed to answer questions using the retrieved document context rather than relying on external knowledge.

If relevant information cannot be found in the uploaded documents, the system can indicate that the information is unavailable instead of fabricating an answer.

🔮 Future Improvements
Streaming responses
Conversation history
Hybrid semantic + keyword retrieval
OCR for scanned PDFs
Background document processing
Cloud deployment
Object storage
Advanced admin dashboard
👨‍💻 Built With

React · Django · PostgreSQL · pgvector · Sentence Transformers · Groq · Docker

📄 License

This project is currently intended as a portfolio and educational project.


**This is the style I'd use.** Much cleaner, proper hierarchy, and GitHub will render the `#`, `##`, and `###` headings distinctly instead of everything looking like one giant document.

Also, I would **not include the DOCX-style README we made earlier**. This Markdown version is much more appropriate for GitHub.