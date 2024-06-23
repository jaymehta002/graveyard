'use client'
import useContactFormStore from '@/store/contactFormStore'
import React from 'react'
import Default from '../Layouts/Default'

const Page = () => {
    const contactData = useContactFormStore(state => state.contactForms)

    return (
        <Default>
            <div className="bg-gray-100 text-gray-800 min-h-screen p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-orange-600">Contact Form Submissions</h1>
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-orange-600">Name</th>
                                <th className="px-4 py-2 text-left text-orange-600">Email</th>
                                <th className="px-4 py-2 text-left text-orange-600">Phone</th>
                                <th className="px-4 py-2 text-left text-orange-600">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactData.map((data, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="px-4 py-2 border-t border-gray-200">{data.name}</td>
                                    <td className="px-4 py-2 border-t border-gray-200">{data.email}</td>
                                    <td className="px-4 py-2 border-t border-gray-200">{data.phone || 'N/A'}</td>
                                    <td className="px-4 py-2 border-t border-gray-200">
                                        <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap" title={data.message}>
                                            {data.message}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {contactData.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No contact form submissions yet.</p>
                )}
            </div>
        </Default>
    )
}

export default Page