from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text):
    """
    Generate a local 384-dimensional embedding.
    """
    embedding = model.encode(text)

    return embedding.tolist()