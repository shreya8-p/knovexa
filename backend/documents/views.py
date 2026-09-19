from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from services.pdf_extractor import extract_text_from_pdf
from services.text_chunker import chunk_text
from services.rag_service import answer_question

from .serializers import DocumentSerializer, RegisterSerializer
from .models import Document, DocumentChunk


class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = DocumentSerializer(data=request.data)

        if serializer.is_valid():
            document = serializer.save(owner=request.user)

            pages = extract_text_from_pdf(document.file.path)

            chunk_index = 0

            for page in pages:
                chunks = chunk_text(page["text"])

                for chunk in chunks:
                    DocumentChunk.objects.create(
                        document=document,
                        content=chunk,
                        page_number=page["page_number"],
                        chunk_index=chunk_index,
                    )

                    chunk_index += 1

            return Response(
                DocumentSerializer(document).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class DocumentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        documents = Document.objects.filter(
            owner=request.user
        ).order_by("-uploaded_at")

        serializer = DocumentSerializer(
            documents,
            many=True
        )

        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "User registered successfully",
                    "username": user.username,
                    "email": user.email,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("question")

        if not question:
            return Response(
                {"error": "Question is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = answer_question(
            question,
            user=request.user
        )

        return Response({
            "question": question,
            "answer": result["answer"],
            "sources": result["sources"],
        })