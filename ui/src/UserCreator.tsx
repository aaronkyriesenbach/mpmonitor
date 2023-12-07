import { useState } from "react";
import { useParams } from "react-router-dom";
import { createUser } from "./Api";
import { Provider } from "./constants";

export default function UserCreator() {
  const { userId } = useParams();
  const [name, setName] = useState("");
  const [provider, setProvider] = useState(Provider.ATT);

  const submit = () => {
    if (userId) {
      createUser(userId, name, provider)
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
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value as Provider)}
      >
        {Object.keys(Provider).map((k) => (
          <option key={k}>{Provider[k as keyof typeof Provider]}</option>
        ))}
      </select>
      <input type="submit" onClick={submit} />
    </div>
  );
}
