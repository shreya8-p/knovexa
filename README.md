KNOVEXA

AI-Powered Document Intelligence & RAG-Based Q&A

Knovexa is a full-stack document intelligence platform that allows users to upload PDF documents and ask natural-language questions about their content. It uses Retrieval-Augmented Generation (RAG) to retrieve relevant document chunks and generate context-grounded answers with document and page-level sources.

Features

User registration and JWT-based authentication

Secure PDF document upload

Automatic PDF text extraction

Automatic text chunking with overlap

Local 384-dimensional sentence embeddings using all-MiniLM-L6-v2

PostgreSQL with pgvector for vector similarity search

Natural-language document Q&A

Groq-powered LLM responses

Document and page-level source citations

Automatic embedding generation during document upload

Document listing and deletion controls

All authenticated users can query the uploaded company knowledge base

How It Works

1. Upload: A user uploads a PDF through the Knovexa dashboard.

2. Extract: The backend extracts text from each PDF page using pypdf.

3. Chunk: Extracted text is divided into overlapping chunks for better retrieval.

4. Embed: Each chunk is converted into a 384-dimensional embedding using all-MiniLM-L6-v2.

5. Store: Document chunks and embeddings are stored in PostgreSQL with pgvector.

6. Retrieve: A question is converted into an embedding and relevant chunks are retrieved using vector similarity.

7. Generate: Retrieved context is passed to the Groq LLM to generate a grounded answer.

8. Cite: The response includes the source document and page number.

Architecture

React + Vite → Django REST API → PDF Extraction → Chunking → Sentence Transformers → PostgreSQL + pgvector → Retrieval → Groq LLM → Answer + Sources

Tech Stack

Frontend: React, Vite, JavaScript, CSS, Lucide React

Backend: Python, Django, Django REST Framework

Authentication: JWT with djangorestframework-simplejwt

Database: PostgreSQL

Vector Search: pgvector

Embeddings: Sentence Transformers — all-MiniLM-L6-v2

LLM: Groq

PDF Processing: pypdf

Containerization: Docker, Docker Compose

Project Structure

knovexa/
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
├── frontend/
│   └── src/
├── documents/
├── docker-compose.yml
├── .gitignore
└── README.md

Local Setup

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/knovexa.git
cd knovexa

2. Start PostgreSQL + pgvector

docker compose up -d

3. Create and activate the virtual environment

python -m venv .venv
.venv\Scripts\activate

4. Install backend dependencies

cd backend
pip install -r requirements.txt

5. Configure environment variables

Create backend/.env and add:
GROQ_API_KEY=your_groq_api_key

6. Apply migrations

python manage.py migrate

7. Start the backend

python manage.py runserver 8001

8. Start the frontend

cd frontend
npm install
npm run dev

API Endpoints

POST  /api/auth/register/ — Register a new user

POST  /api/auth/login/ — Obtain JWT tokens

POST  /api/auth/refresh/ — Refresh an access token

POST  /api/documents/upload/ — Upload and process a PDF

GET  /api/documents/ — List uploaded documents

DELETE  /api/documents/<id>/delete/ — Delete a document if permitted

POST  /api/chat/ — Ask a question about uploaded documents

Document Access

Authenticated users can view and query the uploaded company documents. Document deletion is restricted to the uploader or an administrator.

RAG Design

Knovexa follows a Retrieval-Augmented Generation architecture. The system first retrieves relevant chunks from uploaded documents and then supplies that context to the LLM. This keeps responses grounded in the available source material.

Grounded Responses

The LLM is instructed to answer only from the supplied context and not invent names, dates, numbers, or facts. When relevant information cannot be found in the uploaded documents, Knovexa is designed to indicate that the information is unavailable.

Security Notes

JWT authentication protects authenticated API endpoints.

The Groq API key is stored in an environment variable and must never be committed to Git.

.env files, virtual environments, node_modules, build output, and uploaded media are excluded through .gitignore.

Future Improvements

Streaming LLM responses

Conversation history and persistent chat sessions

Improved hybrid semantic and keyword retrieval

Richer source citations and document previews

OCR support for scanned PDFs

Cloud deployment and object storage

Role-based administration dashboard

Background document processing

Project Goal

Knovexa is designed as an internal knowledge assistant that turns company documents into a searchable, conversational knowledge base while keeping answers grounded in uploaded source material.