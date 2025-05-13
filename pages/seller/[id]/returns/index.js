'use client'
import { useState, useEffect } from 'react'
import { FiPackage, FiCheckCircle, FiXCircle, FiAlertCircle, FiCalendar, FiFileText, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi'

export default function ReturnsPage() {
  const [returns, setReturns] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReturnsData()
  }, [])

  const fetchReturnsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch data from returns.json
      const response = await fetch('/data/returns.json')
      if (!response.ok) {
        throw new Error('Failed to fetch returns data')
      }
      const data = await response.json()
      
      setReturns(data.returns)
      
      // Calculate statistics
      const stats = {
        total: data.returns.length,
        pending: data.returns.filter(r => r.status === 'pending').length,
        approved: data.returns.filter(r => r.status === 'approved').length,
        rejected: data.returns.filter(r => r.status === 'rejected').length
      }
      setStats(stats)
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching returns:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // In a real app, you would make an API call here to update the status
      // For now, we'll just update the local state
      
      setReturns(prevReturns =>
        prevReturns.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      )

      // Update statistics
      setStats(prevStats => {
        const item = returns.find(r => r.id === id)
        const updated = { ...prevStats }
        
        // Decrement previous status
        if (item.status === 'approved') updated.approved -= 1
        else if (item.status === 'rejected') updated.rejected -= 1
        else if (item.status === 'pending') updated.pending -= 1
        
        // Increment new status
        if (newStatus === 'approved') updated.approved += 1
        else if (newStatus === 'rejected') updated.rejected += 1
        else if (newStatus === 'pending') updated.pending += 1
        
        return updated
      })

    } catch (err) {
      console.error('Error updating status:', err)
      setError('Failed to update return status')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-500">Loading return requests...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchReturnsData}
                className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FiPackage className="mr-3 text-indigo-600" size={28} />
            Return & Refund Requests
          </h1>
          <p className="text-gray-600 mt-2">Manage customer return requests efficiently</p>
        </div>
        <button 
          onClick={fetchReturnsData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2 space-y-6">
          {returns.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <FiPackage className="mx-auto text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-700 mt-4">No return requests found</h3>
              <p className="text-gray-500 mt-2">You currently don't have any return requests.</p>
            </div>
          ) : (
            returns.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <FiFileText className="text-indigo-600" size={20} />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">{item.orderId}</h2>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'approved' ? 'bg-green-100 text-green-800' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status === 'approved' ? <FiCheckCircle className="mr-1" /> :
                      item.status === 'rejected' ? <FiXCircle className="mr-1" /> :
                      <FiAlertCircle className="mr-1" />}
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar size={16} />
                      <span>Requested on {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Reason</h3>
                      <p className="text-gray-800">{item.reason}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Proof</h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-md ${
                        item.hasProof ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {item.hasProof ? (
                          <>
                            <FiCheck className="mr-1" size={14} />
                            <span>Proof provided</span>
                          </>
                        ) : (
                          <>
                            <FiX className="mr-1" size={14} />
                            <span>No proof provided</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.status === 'pending' && (
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <FiCheck size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <FiX size={18} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Return Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.total}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <span>Export to CSV</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <span>Print Report</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}