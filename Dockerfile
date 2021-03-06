FROM python

COPY src .

COPY requirements.txt .

RUN pip3 install -r requirements.txt

CMD ["python3", "app.py"]