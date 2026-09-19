from services.text_chunker import chunk_text


text = """
TechFlow AI is a technology company.
Employees must use their company email for official communication.
Working hours are 9:00 AM to 6:00 PM, Monday to Friday.
Employees receive 18 days of paid leave each year.
All company documents must be stored in approved internal systems.
Employees must report security incidents to the IT team immediately.
Remote employees must use the company VPN when accessing internal systems.
"""

chunks = chunk_text(text, chunk_size=20, overlap=5)

for index, chunk in enumerate(chunks):
    print(f"\n--- Chunk {index} ---")
    print(chunk)