# diagram.py
from diagrams import Diagram
from diagrams.aws.integration import SQS
from diagrams.aws.compute import Lambda

with Diagram("Email service", show=False):
    SQS("Email queue") >> Lambda("Email sender")
