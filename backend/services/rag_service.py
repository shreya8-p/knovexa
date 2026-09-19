import re

from services.retrieval_service import search_similar_chunks
from services.llm_service import generate_answer


def retrieve_context(question, user, top_k=3):

    chunks = search_similar_chunks(
        question,
        user=user,
        top_k=top_k
    )

    context = []

    for chunk in chunks:
        context.append({
            "document": chunk.document.title,
            "page": chunk.page_number,
            "content": chunk.content,
            "distance": float(chunk.distance),
        })

    return context


def extract_answer(question, context):

    question_lower = question.lower()

    all_text = " ".join(
        item["content"] for item in context
    )

    if "cgpa" in question_lower:

        match = re.search(
            r"(?:current\s+)?cgpa\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:/10)?",
            all_text,
            re.IGNORECASE
        )

        if match:
            return f"The current CGPA is {match.group(1)}/10."

        return "I couldn't find the CGPA in the relevant uploaded document."

    if "usn" in question_lower:

        match = re.search(
            r"USN\s*[:\-]?\s*([A-Z0-9]+)",
            all_text,
            re.IGNORECASE
        )

        if match:
            return f"The USN is {match.group(1)}."

        return "I couldn't find the USN in the relevant uploaded document."

    if (
        "working hours" in question_lower
        or (
            "hours" in question_lower
            and "employee" in question_lower
        )
    ):

        match = re.search(
            r"(?:working hours are|work(?:ing)? hours are)\s*([^.\n]+)",
            all_text,
            re.IGNORECASE
        )

        if match:
            return f"Employees work {match.group(1).strip()}."

    if (
        "paid leave" in question_lower
        or "leave days" in question_lower
    ):

        match = re.search(
            r"(\d+)\s+days\s+of\s+paid\s+leave[^.]*",
            all_text,
            re.IGNORECASE
        )

        if match:
            return match.group(0).strip() + "."

    

    if (
        "what is given" in question_lower
        or "what is mentioned" in question_lower
        or "what is in" in question_lower
    ):
        return context[0]["content"][:600]

    if "what feedback" in question_lower:
        return context[0]["content"][:600]

    if "experience" in question_lower:
        return context[0]["content"][:600]

    return None


def answer_question(question, user, top_k=3):

    simple_greetings = {
        "hi",
        "hello",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
        "thanks",
        "thank you",
    }

    question_clean = question.strip().lower()

    if question_clean in simple_greetings:
        return {
            "answer": "Hello! How can I help you?",
            "sources": [],
        }

    context = retrieve_context(
        question,
        user=user,
        top_k=top_k
    )

    if not context:
        return {
            "answer": "I couldn't find relevant information in your uploaded documents.",
            "sources": [],
        }

    answer = extract_answer(
        question,
        context
    )

    if not answer:

        context_text = "\n\n".join(
            f"Document: {item['document']}\n"
            f"Page: {item['page']}\n"
            f"Content: {item['content']}"
            for item in context
        )

        try:

            answer = generate_answer(
                question,
                context_text
            )

        except Exception as e:

            print("LLM Error:", e)

            answer = (
                "I found relevant information in the uploaded document, "
                "but I couldn't generate an answer right now."
            )

    seen_sources = set()
    sources = []

    for item in context:

        source_key = (
            item["document"],
            item["page"]
        )

        if source_key not in seen_sources:

            seen_sources.add(source_key)

            sources.append({
                "document": item["document"],
                "page": item["page"],
            })

    return {
        "answer": answer,
        "sources": sources,
    }