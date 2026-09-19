from django.db import models
from django.contrib.auth.models import User
from pgvector.django import VectorField


class Document(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="documents",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class DocumentChunk(models.Model):
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name="chunks"
    )
    content = models.TextField()
    page_number = models.PositiveIntegerField()
    chunk_index = models.PositiveIntegerField()
    embedding = VectorField(
        dimensions=384,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.document.title} - Chunk {self.chunk_index}"