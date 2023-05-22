import { AlertTriangle } from "lucide-react";

type Props = {
  message: string;
};

const Alert: React.FC<Props> = ({ message }) => {
  return (
    <div className="mt-2 rounded-md bg-stone-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle
            className="h-5 w-5 text-stone-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-stone-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
