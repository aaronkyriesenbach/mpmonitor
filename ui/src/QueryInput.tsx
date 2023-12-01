import axios from "axios";
import { useCallback, useState } from "react";

export default function QueryInput(props: QueryInputProps) {
  const { userId, addQuery } = props;
  const [query, setQuery] = useState("");

  const submit = useCallback(() => {
    axios
      .post(`http://localhost:5000/user/${userId}/queries`, {
        query: query,
      })
      .then((res) => {
        if (res.data) {
          addQuery(res.data);
        }
        setQuery("");
      })
      .catch((r) => console.log(r));
  }, [props, query]);

  return (
    <div>
      Add a query:
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <input type="submit" onClick={submit} />
    </div>
  );
}

type QueryInputProps = {
  userId: string;
  addQuery: (query: Query) => void;
};
