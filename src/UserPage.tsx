import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, putUser } from "./Api";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [addQueryText, setAddQueryText] = useState("");

  useEffect(() => {
    if (id) {
      getUser(id).then((res) => {
        if (res.Items?.length === 1) {
          const user = res.Items[0] as User;

          setUser(user);
        }
      });
    }
  }, []);

  const addQuery = () => {
    if (user) {
      const queries = user.queries || [];
      if (!queries.includes(addQueryText)) {
        const updatedUser = { ...user, queries: [...queries, addQueryText] };

        putUser(updatedUser).then(() => setUser(updatedUser));
        setAddQueryText("");
      }
    }
  };

  const removeQuery = (queryToRemove: string) => {
    if (user) {
      const updatedQueries = user.queries?.filter((q) => q !== queryToRemove);

      const updatedUser = { ...user, queries: updatedQueries };

      putUser(updatedUser).then(() => setUser(updatedUser));
    }
  };

  if (user) {
    return (
      <div>
        <h1>Welcome, {user.name}!</h1>
        <h3>Your queries:</h3>
        {user.queries?.map((q) => (
          <div key={q}>
            {q}
            <button onClick={() => removeQuery(q)}>Delete</button>
          </div>
        ))}

        <div>
          Add a query:
          <input
            type="text"
            value={addQueryText}
            onChange={(e) => setAddQueryText(e.target.value)}
          />
          <input type="submit" onClick={addQuery} />
        </div>
      </div>
    );
  } else {
    return (<div>Loading...</div>);
  }
}
