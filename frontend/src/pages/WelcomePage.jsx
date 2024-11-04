import React from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Link } from "react-router-dom"
import {
  Palette,
  Users,
  Search,
  MessageSquare,
  Star,
  Shield,
  Briefcase,
} from "lucide-react"

const WelcomePage = () => {
  return (
    <div className='min-h-screen w-full -mt-16'>
      {/* Hero Section */}
      <section className='relative h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
        <div className='w-full max-w-7xl mx-auto px-6 text-center'>
          <h1 className='text-5xl font-bold mb-6'>
            Connect with Creative Professionals
          </h1>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Find skilled artists, animators, and designers for your projects.
            Our platform streamlines the hiring process for creative
            professionals.
          </p>
          <div className='flex gap-4 justify-center'>
            <Link to='/register'>
              <Button className='bg-white text-black hover:bg-[#0000FF] hover:text-white transition-colors'>
                Get Started
              </Button>
            </Link>
            <Link to='/login'>
              <Button className='bg-white text-black hover:bg-[#0000FF] hover:text-white transition-colors'>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-20 w-full bg-gray-50'>
        <div className='w-full max-w-7xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold mb-4'>How It Works</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Our platform makes it easy to connect creative professionals with
              project owners
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <Card>
              <CardHeader>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                  <Users className='w-6 h-6 text-blue-600' />
                </div>
                <CardTitle>Create Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Register as an artist or project owner. Artists can showcase
                  their portfolio while project owners can post job listings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                  <Search className='w-6 h-6 text-blue-600' />
                </div>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Browse through portfolios or job listings. Use filters to find
                  the perfect match for your project needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                  <MessageSquare className='w-6 h-6 text-blue-600' />
                </div>
                <CardTitle>Collaborate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600'>
                  Communicate directly, manage projects, and handle payments
                  securely through our platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 w-full bg-white'>
        <div className='w-full max-w-7xl mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold mb-4'>Platform Features</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Everything you need to manage creative projects effectively
            </p>
          </div>

          <div className='grid md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Palette className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='font-semibold mb-2'>Portfolio Showcase</h3>
              <p className='text-gray-600'>
                Display your best work and attract clients
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Briefcase className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='font-semibold mb-2'>Job Listings</h3>
              <p className='text-gray-600'>
                Post and find creative project opportunities
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Shield className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='font-semibold mb-2'>Secure Payments</h3>
              <p className='text-gray-600'>
                Safe and reliable payment processing
              </p>
            </div>

            <div className='text-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Star className='w-6 h-6 text-purple-600' />
              </div>
              <h3 className='font-semibold mb-2'>Reviews & Ratings</h3>
              <p className='text-gray-600'>
                Build reputation through client feedback
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white'>
        <div className='w-full max-w-7xl mx-auto px-6 text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready to Get Started?</h2>
          <p className='mb-8 max-w-2xl mx-auto'>
            Join our creative community and start connecting with talented
            professionals or find your next creative project.
          </p>
          <div className='flex gap-4 justify-center'>
            <Link to='/register'>
              <Button className='bg-white text-black hover:bg-[#0000FF] hover:text-white transition-colors'>
                Create Account
              </Button>
            </Link>
            <Link to='/login'>
              <Button className='bg-white text-black hover:bg-[#0000FF] hover:text-white transition-colors'>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WelcomePage
