import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QueryInput from "./QueryInput";
import UserCreator from "./UserCreator";

export default function UserPage() {
  const { userId } = useParams();
  const [firstName, setFirstName] = useState("");
  const [queries, setQueries] = useState<Query[]>([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/user/${userId}`)
      .then((res) => {
        if (res.data) {
          setFirstName(res.data);
        }
      })
      .catch((r) => console.log(r));
  }, []);

  useEffect(() => {
    // If user exists
    if (firstName) {
      axios.get(`http://localhost:5000/user/${userId}/queries`).then((res) => {
        setQueries(res.data.map((q: string) => JSON.parse(q)));
      });
    }
  }, [firstName]);

  const deleteQuery = (queryId: number) => {
    axios
      .delete(`http://localhost:5000/user/${userId}/queries/${queryId}`)
      .then(() => setQueries(queries.filter((q) => q.id != queryId)))
      .catch((r) => console.log(r));
  };

  if (firstName) {
    return (
      <div>
        <h1>Welcome, {firstName}!</h1>
        <h3>Your queries:</h3>
        {queries.map((q) => (
          <div key={q.id}>
            {q.query}
            <button onClick={() => deleteQuery(q.id)}>Delete</button>
          </div>
        ))}
        <div>
          <QueryInput
            userId={userId!}
            addQuery={(q) => setQueries([...queries, q])}
          />
        </div>
      </div>
    );
  } else {
    return <UserCreator />;
  }
}
