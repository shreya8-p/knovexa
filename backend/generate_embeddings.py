import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from documents.models import DocumentChunk
from services.embedding_service import generate_embedding


chunks = DocumentChunk.objects.filter(embedding__isnull=True)

print(f"Chunks without embeddings: {chunks.count()}")

for chunk in chunks:
    print(f"Processing chunk {chunk.chunk_index}...")

    embedding = generate_embedding(chunk.content)

    chunk.embedding = embedding
    chunk.save(update_fields=["embedding"])

print("All embeddings generated successfully!")