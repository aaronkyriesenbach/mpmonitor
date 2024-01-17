import { useState } from "react";
import { useParams } from "react-router-dom";
import { createUser } from "./Api";

export default function UserCreator() {
  const { userId } = useParams();
  const [name, setName] = useState("");

  const submit = () => {
    if (userId) {
      createUser(userId, name)
        .then(() => window.location.reload())
        .catch((r) => console.log(r));
    }
  };

  return (
    <div>
      First name:
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="submit" onClick={submit} />
    </div>
  );
}
