import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from services.retrieval_service import search_similar_chunks


query = "How many days of paid leave do employees receive?"

results = search_similar_chunks(query)

print(f"\nFound {len(results)} relevant chunks\n")

for chunk in results:
    print("=" * 60)
    print("Document:", chunk.document.title)
    print("Page:", chunk.page_number)
    print("Chunk:", chunk.chunk_index)
    print("Content:")
    print(chunk.content)