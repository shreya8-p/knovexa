from services.embedding_service import generate_embedding

text = "Employees receive 18 days of paid leave each year."

embedding = generate_embedding(text)

print("Embedding generated successfully")
print("Dimensions:", len(embedding))
print("First 5 values:", embedding[:5])