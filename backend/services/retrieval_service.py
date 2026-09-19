import re

from pgvector.django import CosineDistance

from documents.models import DocumentChunk
from services.embedding_service import generate_embedding


STOP_WORDS = {
    "what",
    "who",
    "where",
    "when",
    "why",
    "how",
    "which",
    "whose",
    "is",
    "are",
    "was",
    "were",
    "the",
    "a",
    "an",
    "of",
    "to",
    "for",
    "in",
    "on",
    "and",
    "or",
    "do",
    "does",
    "did",
    "can",
    "could",
    "would",
    "should",
    "tell",
    "me",
    "about",
    "please",
    "give",
    "has",
    "have",
    "had",
    "their",
    "his",
    "her",
    "they",
    "them",
    "this",
    "that",
    "document",
    "pdf",
}


def search_similar_chunks(query, user, top_k=3):

    query_embedding = generate_embedding(query)

    all_chunks = list(
        DocumentChunk.objects
        .filter(
            document__owner=user,
            embedding__isnull=False,
        )
        .annotate(
            distance=CosineDistance("embedding", query_embedding)
        )
        .order_by("distance")
    )

    if not all_chunks:
        return []

    query_words = set(
        re.findall(r"[a-zA-Z]+", query.lower())
    )

    important_words = {
        word
        for word in query_words
        if len(word) >= 3 and word not in STOP_WORDS
    }

    if important_words:

        document_scores = {}

        for chunk in all_chunks:

            document_id = chunk.document_id
            content = chunk.content.lower()
            document_name = chunk.document.title.lower()

            score = document_scores.get(document_id, 0)

            for word in important_words:

                if word in content:
                    score += 5

                if word in document_name:
                    score += 10

            document_scores[document_id] = score

        matching_documents = [
            document_id
            for document_id, score in document_scores.items()
            if score > 0
        ]

        if matching_documents:

            best_document = max(
                matching_documents,
                key=lambda document_id: document_scores[document_id]
            )

            document_chunks = [
                chunk
                for chunk in all_chunks
                if chunk.document_id == best_document
            ]

            document_chunks.sort(
                key=lambda chunk: chunk.distance
            )

            return document_chunks[:top_k]

    return all_chunks[:top_k]