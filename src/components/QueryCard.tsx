export default function QueryCard(props: QueryCardProps) {
  const { query, removeQuery } = props;

  return (
    <div className="border rounded p-2 d-flex gap-2 ms-2">
      {query}
      <button onClick={() => removeQuery(query)} className="border border-0">
        x
      </button>
    </div>
  );
}

type QueryCardProps = {
  query: string;
  removeQuery: (query: string) => void;
};
