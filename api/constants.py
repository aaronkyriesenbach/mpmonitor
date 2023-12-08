from enum import Enum
import os


DB_PATH = os.environ["DB_PATH"] or "database.db"
FORUM_PATH = (
    "https://www.mountainproject.com/forum/103989416/for-sale-for-free-want-to-buy"
)


class Provider(str, Enum):
    ATT = "AT&T"
    FI = "Google Fi"
    SPRINT = "Sprint"
    TMOBILE = "T-Mobile"
    VERIZON = "Verizon"


EMAIL_SMS_DOMAINS = {
    Provider.ATT: "txt.att.net",
    Provider.FI: "msg.fi.google.com",
    Provider.SPRINT: "messaging.sprintpcs.com",
    Provider.TMOBILE: "tmomail.net",
    Provider.VERIZON: "vtext.com",
}
