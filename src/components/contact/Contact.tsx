import { db } from '@/config/firebase'
import { addDoc, collection } from 'firebase/firestore'
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const contactData = {
        ...formData,
        timestamp: new Date(),
      }
      const contactsCollection = collection(db, 'contactForm');
      await addDoc(contactsCollection, contactData)

      toast.success('Thank you for your message!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (error) {
      console.error('Error submitting form: ', error)
      toast.error('Failed to send message. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl w-full mx-auto p-6 bg-white text-black rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-black mb-8">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Your Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          required
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[150px]"
        ></textarea>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-gray-500 text-black rounded-md hover:bg-gray-800 transition duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mx-auto"></div>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  )
}

export default ContactForm