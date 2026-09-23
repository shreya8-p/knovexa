from django.shortcuts import get_object_or_404

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from services.pdf_extractor import extract_text_from_pdf
from services.text_chunker import chunk_text
from services.rag_service import answer_question
from services.embedding_service import generate_embedding
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
                    embedding = generate_embedding(chunk)
                    DocumentChunk.objects.create(
                        document=document,
                        content=chunk,
                        page_number=page["page_number"],
                        chunk_index=chunk_index,
                        embedding=embedding,
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
        documents = Document.objects.all().order_by("-uploaded_at")

        serializer = DocumentSerializer(
            documents,
            many=True
        )

        return Response(serializer.data)


class DocumentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, document_id):

        document = get_object_or_404(
            Document,
            id=document_id
        )

        if (
            document.owner != request.user
            and not request.user.is_staff
        ):
            return Response(
                {
                    "error": "You can only delete documents uploaded by you."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        document.delete()

        return Response(
            {"message": "Document deleted successfully."},
            status=status.HTTP_200_OK
        )

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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["is_admin"] = user.is_staff

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


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