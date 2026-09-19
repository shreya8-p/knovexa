from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

text = "Employees receive 18 days of paid leave each year."

embedding = model.encode(text)

print("Embedding generated successfully")
print("Dimensions:", len(embedding))
print("First 5 values:", embedding[:5])