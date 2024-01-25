import { FormEvent, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getUserByPhone, putUser } from "./Api";
import Navbar from "./components/Navbar";

export default function LandingPage() {
  const [phone, setPhone] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [name, setName] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();

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
      <form
        className="d-flex flex-column align-items-center justify-content-center h-100 content gap-4"
        onSubmit={submit}
      >
        <h1>Welcome to MP Monitor!</h1>
        <PhoneInput
          defaultCountry="US"
          value={phone}
          onChange={(val) => setPhone(val as string)}
        />
        {creatingUser && (
          <div className="d-flex gap-2">
            <div>First name:</div>
            <input
              type="text"
              id="nameInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            !(phone && isValidPhoneNumber(phone)) || (creatingUser && !name)
          }
        >
          Submit
        </button>
      </form>
    </div>
  );
}
