export default function CategorizeHeader() {
  return (
    <>
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900">
        <span className="mr-1 rounded-md bg-gray-200 px-1.5 py-0.5 text-lg">
          3.
        </span>{" "}
        Code
      </h1>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-700">
        Code your transactions using the uploaded general ledger and bank
        statement(s) above.
      </p>
    </>
  );
}
