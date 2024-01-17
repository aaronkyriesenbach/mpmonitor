import { useState } from "react";
import { putUser } from "./Api";

export default function UserCreator() {
  const [name, setName] = useState("");

  const submit = () => {
      putUser(name).then(res => {
        console.log(res);
      })
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
