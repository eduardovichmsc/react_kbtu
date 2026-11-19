interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({
  message = "Loading...",
}: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
