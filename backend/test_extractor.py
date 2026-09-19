from services.pdf_extractor import extract_text_from_pdf

pdf_path = "../documents/test-handbook.pdf"

pages = extract_text_from_pdf(pdf_path)

for page in pages:
    print(f"\n--- Page {page['page_number']} ---")
    print(page["text"])