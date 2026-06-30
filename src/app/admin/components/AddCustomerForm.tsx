'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { createCustomer } from '@/actions/admin'
import { AlertCircle, CheckCircle2, Building, User, Phone, MapPin, Lock, FileText, Users, Printer } from 'lucide-react'

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#0B2E59] hover:bg-[#071f3e] text-white font-bold py-3 px-10 rounded shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
    >
      {pending ? 'Processing...' : 'Authorize & Open Account'}
    </button>
  )
}

export default function AddCustomerForm() {
  const [state, formAction] = useActionState(createCustomer, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [state])

  return (
    <div className="bg-[#F4F6F9] min-h-full font-sans pb-12 overflow-y-auto w-full h-full p-4 sm:p-8">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
        <div>
           <h1 className="text-2xl font-bold text-[#0B2E59] uppercase">New Account Registration</h1>
        </div>
        <button type="button" onClick={() => window.print()} className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50">
          <Printer className="w-4 h-4" /> Print Form
        </button>
      </div>

      <div className="bg-white shadow-md border border-gray-300 max-w-5xl mx-auto">
        
        {/* Bank Header */}
        <div className="bg-[#0B2E59] text-white p-6 border-b-4 border-[#0099CC] flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0">
             <Building className="w-8 h-8 text-[#0B2E59]" />
          </div>
          <div>
             <h1 className="text-2xl font-bold uppercase tracking-wide">Account Opening Form</h1>
             <p className="text-blue-200 text-sm font-medium tracking-wide">Core Banking System • Customer Registration</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Status Messages */}
          {state?.error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 rounded flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h4 className="text-red-800 font-bold uppercase text-sm">Registration Failed</h4>
                <p className="text-red-700 text-sm font-medium mt-1">{state.error}</p>
              </div>
            </div>
          )}

          {state?.success && (
            <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-600 rounded flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <h4 className="text-green-800 font-bold uppercase text-sm">Account Opened Successfully</h4>
                <p className="text-green-700 text-sm font-medium mt-1">{state.success}</p>
              </div>
            </div>
          )}

          <form ref={formRef} action={formAction} className="space-y-8">
            
            {/* SECTION 1: Personal Details */}
            <div className="border border-gray-200 rounded">
               <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h3 className="text-[13px] font-bold text-[#0B2E59] uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> 1. Personal Details
                  </h3>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="fullName" 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Occupation</label>
                    <input 
                      type="text" 
                      name="occupation" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900 uppercase"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Guardian Name</label>
                    <input 
                      type="text" 
                      name="guardianName" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>
            </div>

            {/* SECTION 2: Contact Information */}
            <div className="border border-gray-200 rounded">
               <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h3 className="text-[13px] font-bold text-[#0B2E59] uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4" /> 2. Contact Information
                  </h3>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Primary Mobile Number <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      name="mobile" 
                      required 
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Secondary Mobile</label>
                    <input 
                      type="tel" 
                      name="secondaryMobile" 
                      pattern="[0-9]{10}"
                      maxLength={10}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Full Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>
            </div>

            {/* SECTION 3: Account Security */}
            <div className="border border-gray-200 rounded">
               <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h3 className="text-[13px] font-bold text-[#0B2E59] uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4" /> 3. Account Security
                  </h3>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                     <p className="text-sm text-gray-500 font-medium mb-4">Create a 4-digit PIN that the customer will use to login to their passbook.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">4-Digit PIN <span className="text-red-500">*</span></label>
                    <input 
                      type="password" 
                      name="pin" 
                      required 
                      pattern="[0-9]{4}"
                      maxLength={4}
                      placeholder="e.g. 1234"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-xl tracking-[0.5em] font-bold text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Confirm PIN <span className="text-red-500">*</span></label>
                    <input 
                      type="password" 
                      name="confirmPin" 
                      required 
                      pattern="[0-9]{4}"
                      maxLength={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-xl tracking-[0.5em] font-bold text-gray-900"
                    />
                  </div>
               </div>
            </div>

            {/* SECTION 4: KYC & Declarations */}
            <div className="border border-gray-200 rounded">
               <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h3 className="text-[13px] font-bold text-[#0B2E59] uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 4. KYC & Declarations
                  </h3>
               </div>
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">KYC Document Details</label>
                    <input 
                      type="text" 
                      name="kycDocument" 
                      placeholder="e.g. Aadhar: 1234..."
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Nominee Details</label>
                    <input 
                      type="text" 
                      name="nomineeDetails" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900 uppercase"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Guarantor Details</label>
                    <input 
                      type="text" 
                      name="guarantorOptional" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099CC] focus:border-[#0099CC] outline-none text-sm font-bold text-gray-900 uppercase"
                    />
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 -mx-6 -mb-8 sm:-mx-8 p-6 sm:p-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
               <p className="text-xs text-gray-500 font-bold uppercase">
                  Verify all details before submitting
               </p>
               <SubmitBtn />
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
