import { useEffect, useState } from "react";
import { getUserByPhone, putUser } from "./Api";
import Navbar from "./components/Navbar";

const phoneRegex = new RegExp(/^\+1\d{10}$/);

export default function LandingPage() {
  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => setValidPhone(phoneRegex.test(phone)), [phone]);

  const submit = () => {
    if (creatingUser) {
      const newUser: User = {
        id: crypto.randomUUID(),
        phone: phone,
        name: name,
      };

      putUser(newUser).then(
        () => (window.location.href = `/user/${newUser.id}`)
      );
    } else {
      getUserByPhone(phone).then((res) => {
        const matchingUsers = res.Items as User[];

        if (matchingUsers.length === 1) {
          const user = matchingUsers[0];

          window.location.href = `/user/${user.id}`;
        } else {
          setCreatingUser(true);
        }
      });
    }
  };

  return (
    <div className="h-100">
      <Navbar />
      <div className="d-flex flex-column align-items-center justify-content-center h-100 content">
        Phone number (format +1xxxxxxxxxx):
        <input
          type="text"
          id="phoneInput"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {creatingUser && (
          <div>
            First name:
            <input
              type="text"
              id="nameInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <input type="submit" disabled={!validPhone} onClick={submit} />
      </div>
    </div>
  );
}
