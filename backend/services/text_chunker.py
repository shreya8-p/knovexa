def chunk_text(text, chunk_size=500, overlap=50):
    """
    Split text into smaller chunks with overlap.

    Args:
        text: Text to split.
        chunk_size: Maximum number of words in each chunk.
        overlap: Number of words shared between consecutive chunks.

    Returns:
        A list of text chunks.
    """

    words = text.split()

    if not words:
        return []

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size

        chunk = " ".join(words[start:end])
        chunks.append(chunk)

        if end >= len(words):
            break

        start = end - overlap

    return chunks