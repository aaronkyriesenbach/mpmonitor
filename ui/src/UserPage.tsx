import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QueryInput from "./QueryInput";
import UserCreator from "./UserCreator";
import { deleteQuery, getUser, getUserQueries } from "./Api";

export default function UserPage() {
  const { userId } = useParams();
  const [firstName, setFirstName] = useState("");
  const [queries, setQueries] = useState<Query[]>([]);

  useEffect(() => {
    if (userId) {
      getUser(userId)
        .then((res) => {
          if (res.data) {
            setFirstName(res.data);
          }
        })
        .catch((r) => console.log(r));
    }
  }, []);

  useEffect(() => {
    if (userId && firstName) {
      getUserQueries(userId).then((res) => {
        setQueries(res.data.map((q: string) => JSON.parse(q)));
      });
    }
  }, [firstName]);

  const deleteQueryAndHide = (queryId: number) => {
    deleteQuery(queryId)
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
            <button onClick={() => deleteQueryAndHide(q.id)}>Delete</button>
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
