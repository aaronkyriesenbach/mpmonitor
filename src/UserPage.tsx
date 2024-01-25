import { FormEvent, createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, putUser } from "./Api";
import Navbar from "./components/Navbar";
import QueryCard from "./components/QueryCard";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [addQueryText, setAddQueryText] = useState("");
  const addQueryRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (id) {
      getUser(id).then((res) => {
        if (res.Items?.length === 1) {
          const user = res.Items[0] as User;

          setUser(user);
        }
      });
    }

    addQueryRef.current?.focus();
  }, [id, user]);

  const addQuery = (e: FormEvent) => {
    e.preventDefault();

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
      <div className="h-100">
        <Navbar />
        <div className="d-flex flex-column align-items-start h-100 content gap-4 px-4">
          <h1 className="mt-4">Welcome, {user.name}!</h1>
          <h3>Your queries:</h3>
          {user.queries?.map((q) => (
            <QueryCard key={q} query={q} removeQuery={removeQuery} />
          ))}

          <form className="d-flex gap-2 mt-2" onSubmit={addQuery}>
            <input
              placeholder="Add a query"
              ref={addQueryRef}
              className="ps-2"
              type="text"
              value={addQueryText}
              onChange={(e) => setAddQueryText(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!addQueryText || user.queries?.includes(addQueryText)}
            >
              Add
            </button>
          </form>
          {user.queries?.includes(addQueryText) &&
            "You've already added this query"}

          <div>
            Guidelines on writing queries:
            <ul>
              <li>Queries are case-insensitive</li>
              <li>
                Matching is performed exactly, so keep queries broad. For
                example "medium men's belay parka" will only match if the poster
                writes it exactly like that, so it might be better to just try
                "belay parka".
              </li>
              <li>
                In the same vein, try keeping it singular. For example, the
                query "ice tool" will match both "ice tool" and "ice tools", but
                "ice tools" will only match the latter.
              </li>
              <li>
                Make sure to match abbreviations as well as full names (i.e. use
                both "black diamond" and "bd")
              </li>
            </ul>
            Ask me (Aaron) if you have questions!
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
