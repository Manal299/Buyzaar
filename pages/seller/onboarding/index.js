import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function SellerOnboarding() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    storeAddress: "",
    storeCity: "",
    storeState: "",
    storeZip: "",
    storeCountry: "",
    storePhone: "",
    storeWebsite: "",
    businessType: "individual", // individual, llc, corporation
    taxId: "",
    establishedYear: new Date().getFullYear(),
    categories: [],
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    acceptedTerms: false
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Business types for dropdown
  const businessTypes = [
    { value: "individual", label: "Individual/Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "llc", label: "Limited Liability Company (LLC)" },
    { value: "corporation", label: "Corporation" },
    { value: "nonprofit", label: "Nonprofit Organization" }
  ];
  
  // Product categories
  const categoryOptions = [
    "Electronic Accessories",
    "TV & Home Appliances",
    "Health & Beauty",
    "Mother & Baby",
    "Electronic Devices",
    "Groceries & Pets",
    "Home & Lifestyle",
    "Women's Fashion",
    "Men's Fashion",
    "Watches, Bags & Jewellery",
    "Sports & Outdoor",
    "Automotive & Motorbike"
  ];
  
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (status === 'unauthenticated') {
      // Redirect unauthenticated users to login
      console.log('Not authenticated, redirecting to login');
      router.replace('/login');
    } else if (session.user.role !== 'seller' || session.user.isOnboarded) {
      // Redirect non-sellers or already onboarded users
      console.log('Not a seller or already onboarded, redirecting to home');
      router.replace('/');
    }
  }, [session, status, router]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle category selection
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        categories: prev.categories.filter(category => category !== value)
      }));
    }
  };
  
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError("");
  setSuccess("");

  // Validate form
  if (!formData.storeName || !formData.storeAddress || !formData.businessType) {
    setError("Please fill in all required fields.");
    setSubmitting(false);
    return;
  }

  if (!formData.acceptedTerms) {
    setError("You must accept the terms and conditions to continue.");
    setSubmitting(false);
    return;
  }

  try {
    // Send data to API to update user storeInfo
    console.log('Submitting data to API:', formData);

    const response = await fetch('/api/seller/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData),
      credentials: 'include' // Include cookies in the request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    setSuccess("Store information saved successfully!");

    // Redirect to thank you page after a short delay
    setTimeout(() => {
      // Use window.location for a hard navigation to avoid state issues
      window.location.href = '/thank-you';
    }, 2000);

    // Sign out the user after onboarding is complete
    signOut();

  } catch (err) {
    console.error('Onboarding error:', err);
    setError(err.message || "Failed to save store information. Please try again.");
  } finally {
    setSubmitting(false);
  }
};
  
  // Show loading screen while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Seller Onboarding | Buyzaar</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-blue-600">Buyzaar</h1>
            </Link>
            <div className="text-sm text-gray-600">Seller Onboarding</div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Seller Profile</h2>
            <p className="text-gray-600 mb-8">
              Please provide the following information to set up your seller account. This information will be used to identify you to customers and for payment processing.
            </p>
            
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store Information Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Store Information</h3>
                <div className="space-y-4">
                  {/* Store Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeName">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Store Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeDescription">
                      Store Description
                    </label>
                    <textarea
                      id="storeDescription"
                      name="storeDescription"
                      value={formData.storeDescription}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Store Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeAddress">
                      Store Address *
                    </label>
                    <input
                      type="text"
                      id="storeAddress"
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  {/* Store City, State, Zip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeCity">
                        City
                      </label>
                      <input
                        type="text"
                        id="storeCity"
                        name="storeCity"
                        value={formData.storeCity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeState">
                        State/Province
                      </label>
                      <input
                        type="text"
                        id="storeState"
                        name="storeState"
                        value={formData.storeState}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeZip">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="storeZip"
                        name="storeZip"
                        value={formData.storeZip}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Country and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeCountry">
                        Country
                      </label>
                      <input
                        type="text"
                        id="storeCountry"
                        name="storeCountry"
                        value={formData.storeCountry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storePhone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="storePhone"
                        name="storePhone"
                        value={formData.storePhone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storeWebsite">
                      Website (if any)
                    </label>
                    <input
                      type="url"
                      id="storeWebsite"
                      name="storeWebsite"
                      value={formData.storeWebsite}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Business Information Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
                <div className="space-y-4">
                  {/* Business Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="businessType">
                      Business Type *
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {businessTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Tax ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="taxId">
                      Tax ID / Business Registration Number
                    </label>
                    <input
                      type="text"
                      id="taxId"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Established Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="establishedYear">
                      Year Established
                    </label>
                    <input
                      type="number"
                      id="establishedYear"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Product Categories Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Categories</h3>
                <p className="text-sm text-gray-600 mb-3">Select the categories that best describe your products</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryOptions.map(category => (
                    <div key={category} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        name="categories"
                        value={category}
                        checked={formData.categories.includes(category)}
                        onChange={handleCategoryChange}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Banking Information Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                <p className="text-sm text-gray-600 mb-3">
                  This information will be used for seller payouts. We ensure it is kept secure.
                </p>
                
                <div className="space-y-4">
                  {/* Bank Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bankName">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="accountNumber">
                      Account Number
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Routing Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="routingNumber">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      id="routingNumber"
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div className="flex items-start mb-6">
                <input
                  type="checkbox"
                  id="acceptedTerms"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="acceptedTerms" className="ml-2 text-sm text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Seller Policy</a>
                </label>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Complete Registration"}
                </button>
              </div>
            </form>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm">© {new Date().getFullYear()} Buyzaar. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 