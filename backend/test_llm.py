import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from services.llm_service import generate_answer


question = "How many days of paid leave do employees receive?"

context = """
TechFlow AI Employee Handbook:
Employees receive 18 days of paid leave each year.
"""

answer = generate_answer(question, context)

print("\nQuestion:", question)
print("Answer:", answer)