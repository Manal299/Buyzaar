// app/not-found.jsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">Oops! That page doesn’t exist.</p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">Go back home</a>
    </div>
  );
}
