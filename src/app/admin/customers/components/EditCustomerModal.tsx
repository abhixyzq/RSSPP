'use client'

import { useState, useActionState, useEffect } from 'react'
import { updateCustomerDetails } from '@/actions/admin'
import { Edit, X, User, Phone, MapPin, Briefcase, FileText, Users, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function EditCustomerModal({ profile }: { profile: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction] = useActionState(updateCustomerDetails, null)

  // Close modal automatically on success after a short delay
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => setIsOpen(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [state?.success])

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm font-bold text-white bg-[#0099CC] px-4 py-2 rounded-md shadow-sm hover:bg-[#007ba6] flex items-center gap-2"
      >
        <Edit className="w-4 h-4" /> Edit Profile
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-t-4 border-[#0B2E59]">
        
        <div className="bg-[#0B2E59] text-white p-6 flex items-center justify-between sticky top-0 z-10">
           <div>
              <h2 className="text-xl font-bold uppercase tracking-wide">Edit Customer Details</h2>
              <p className="text-blue-200 text-xs font-medium">Update account information</p>
           </div>
           <button 
             onClick={() => setIsOpen(false)}
             className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-6">
          {state?.error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-bold border border-red-200 rounded flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{state.error}</p>
            </div>
          )}
          
          {state?.success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-bold border border-green-200 rounded flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>{state.success}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="customerId" value={profile.id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               
               {/* Read Only Mobile */}
               <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Registered Mobile No. (Read-Only)</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-500 font-bold">
                     <Phone className="w-5 h-5" />
                     <span>{profile.mobile_number}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Mobile number is linked to login and cannot be changed.</p>
               </div>

               <div>
                  <label className="block text-xs font-bold text-[#0B2E59] uppercase tracking-wide mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="fullName" 
                      defaultValue={profile.full_name} 
                      required 
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-gray-900"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-[#0B2E59] uppercase tracking-wide mb-2">Secondary Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="secondaryMobile" 
                      defaultValue={profile.secondary_mobile || ''} 
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-gray-900"
                    />
                  </div>
               </div>

               <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#0B2E59] uppercase tracking-wide mb-2">Full Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="address" 
                      defaultValue={profile.address || ''} 
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-[#0B2E59] uppercase tracking-wide mb-2">Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="occupation" 
                      defaultValue={profile.occupation || ''} 
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-[#0B2E59] uppercase tracking-wide mb-2">KYC Document</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="kycDocument" 
                      defaultValue={profile.kyc_document || ''} 
                      placeholder="e.g. Aadhar: 1234..."
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-[#0B2E59] uppercase tracking-wide mb-2">Guardian Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="guardianName" 
                      defaultValue={profile.guardian_name || ''} 
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-[#0B2E59] uppercase tracking-wide mb-2">Nominee Details</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="nomineeDetails" 
                      defaultValue={profile.nominee_details || ''} 
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>

               <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#0B2E59] uppercase tracking-wide mb-2">Guarantor Details (Optional)</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      name="guarantorOptional" 
                      defaultValue={profile.guarantor_details || ''} 
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>

            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
               <button 
                 type="button" 
                 onClick={() => setIsOpen(false)}
                 className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors"
               >
                 CANCEL
               </button>
               <button 
                 type="submit" 
                 className="flex-1 px-4 py-3 bg-[#0B2E59] text-white font-bold rounded-md hover:bg-[#071f3e] transition-colors"
               >
                 SAVE CHANGES
               </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}
