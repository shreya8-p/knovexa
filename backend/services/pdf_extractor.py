from pypdf import PdfReader


def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF page by page.

    Returns:
        A list of dictionaries containing page number and text.
    """

    reader = PdfReader(file_path)

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        pages.append({
            "page_number": page_number,
            "text": text.strip(),
        })

    return pages