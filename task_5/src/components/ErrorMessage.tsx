interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-5 my-4 max-w-xl mx-auto text-center">
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      <p className="text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
