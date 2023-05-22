import { CircleOff } from "lucide-react";
import type { Transaction } from "~/types/transaction";

type Props = {
  transactions: Transaction[];
};

const TableCodedTransactions: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="mt-4 overflow-hidden rounded">
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4">
          <CircleOff className="mb-4 h-12 w-12 text-stone-200" />
          <p className="text-center text-stone-500">
            There are currently no coded transactions to display.
          </p>
        </div>
      ) : (
        <table className="min-w-full table-auto">
          <thead className="justify-between">
            <tr className="bg-stone-500">
              <th className="px-2 py-2 text-left text-sm font-medium text-white">
                Date
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-white">
                Description
              </th>
              <th className="px-2 py-2 text-left text-sm font-medium text-white">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-stone-200">
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="px-2 py-2 text-sm text-stone-700">
                  {transaction.date}
                </td>
                <td className="px-2 py-2 text-sm text-stone-700">
                  {transaction.description}
                </td>
                <td className="px-2 py-2 text-sm text-stone-700">
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableCodedTransactions;
