export default function ServiceIcon({ name }) {
  if (name === "training") {
    return (
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path d="M7 11v10M4 13v6M25 11v10M28 13v6M7 16h18M11 9v14M21 9v14" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path d="M16 27C15 17 9 12 5 10c-1 9 3 15 11 17Z" />
      <path d="M16 27c1-10 7-15 11-17 1 9-3 15-11 17Z" />
      <path d="M16 27V8" />
      <path d="M16 8c-4 3-5 7 0 11 5-4 4-8 0-11Z" />
    </svg>
  );
}
