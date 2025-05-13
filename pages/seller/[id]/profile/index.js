import fs from 'fs/promises'
import path from 'path'
import { FiShoppingBag, FiCreditCard, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default async function ProfilePage() {
  // Read data/sellerProfile.json directly
  const filePath = path.join(process.cwd(), 'data', 'sellerProfile.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  const { storeName, description, logoUrl, payment, contact } = JSON.parse(raw)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 transition-all duration-300 hover:shadow-2xl">
        
        {/* Logo Panel - Enhanced with gradient background */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 flex flex-col items-center justify-center space-y-6 text-center text-white">
          <div className="relative group">
            <img
              src={logoUrl}
              alt="Store Logo"
              className="h-40 w-40 rounded-full border-4 border-white shadow-xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-indigo-300 transition-all duration-300"></div>
          </div>
          
          <h2 className="text-2xl font-bold">{storeName}</h2>
          <div className="flex space-x-4">
            {contact?.social?.map((social, index) => (
              <a 
                key={index}
                href={social.url}
                className="text-white hover:text-indigo-200 transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        <div className="md:col-span-2 p-8 space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-800">{storeName}</h1>
            <p className="text-gray-600 leading-relaxed border-l-4 border-indigo-200 pl-4 italic">
              "{description}"
            </p>
          </div>

          {/* Contact Information */}
          {contact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contact.email && (
                <div className="flex items-center space-x-3">
                  <FiMail className="text-indigo-600 text-xl" />
                  <div>
                    <span className="block text-sm text-gray-500">Email</span>
                    <a href={`mailto:${contact.email}`} className="text-gray-800 hover:text-indigo-600 transition-colors">
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}
              
              {contact.phone && (
                <div className="flex items-center space-x-3">
                  <FiPhone className="text-indigo-600 text-xl" />
                  <div>
                    <span className="block text-sm text-gray-500">Phone</span>
                    <a href={`tel:${contact.phone}`} className="text-gray-800 hover:text-indigo-600 transition-colors">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {contact.address && (
                <div className="flex items-start space-x-3 sm:col-span-2">
                  <FiMapPin className="text-indigo-600 text-xl mt-1" />
                  <div>
                    <span className="block text-sm text-gray-500">Address</span>
                    <span className="text-gray-800">{contact.address}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Info - Enhanced with icon */}
          <div className="mt-6 bg-gray-50 p-6 rounded-xl space-y-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <FiCreditCard className="text-indigo-600 text-2xl" />
              <h2 className="text-2xl font-semibold text-gray-800">Payment Information</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="block text-sm text-gray-500">Method</span>
                <span className="block text-lg font-medium text-gray-800">{payment.method}</span>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <span className="block text-sm text-gray-500">Details</span>
                <span className="block text-lg font-medium text-gray-800">{payment.details}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          {contact?.hours && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-2">Business Hours</h3>
              <ul className="space-y-1">
                {contact.hours.map((hour, index) => (
                  <li key={index} className="flex justify-between text-sm text-gray-700">
                    <span>{hour.day}</span>
                    <span>{hour.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}