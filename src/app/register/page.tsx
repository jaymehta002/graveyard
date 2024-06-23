'use client'
import Navbar from '@/components/NavBar/page'
import SignUpPage from '@/components/Signup/page'
import React from 'react'
import Layout from '@/template/DefaultLayout'
const page = () => {
  return (
    <Layout>
      <SignUpPage />
    </Layout>
  )
}

export default page
