import Head from 'next/head';
import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <>
      <Head>
        <title>Thank You | Buyzaar</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">Thank You for Choosing Buyzaar!</h1>
          <p className="text-gray-700 mb-6">
            Your request is pending. We appreciate your patience and will notify you once your account is approved.
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
}
