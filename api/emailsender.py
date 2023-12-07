import smtplib, ssl
import os


def send(address, message):
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(
            os.environ["MPMONITOR_EMAIL"], os.environ["MPMONITOR_APP_PASSWORD"]
        )

        print(f"Sending message '{message}' to email {address}")
        server.sendmail(os.environ["MPMONITOR_EMAIL"], address, message)
