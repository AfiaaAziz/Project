import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  MapPin,
  User,
  Calendar,
  Camera,
} from "lucide-react";

const HomePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqData = [
    {
      question: "How does the payment splitting work?",
      answer:
        "Our platform uses Stripe Connect to securely and automatically split payments between the photographer and the designated charity. You set the percentages when you create the fundraiser, and we handle the rest.",
    },
    {
      question: "What types of events work best with GoodPix?",
      answer:
        "GoodPix is perfect for any event where memories are being made! This includes charity galas, 5K races, community festivals, school functions, mission trips, and even private events like family reunions where guests might want to support a cause.",
    },
    {
      question: "Do I need to be a professional photographer to use this?",
      answer:
        "Not at all! While we offer tools for professionals, GoodPix is designed for everyone—from seasoned pros to passionate hobbyists and designated event photographers. As long as you can capture great moments, you can create a successful fundraiser.",
    },
    {
      question: "How do people find and purchase photos?",
      answer:
        "Each fundraiser gets a unique, shareable link and a QR code. Organizers can display the QR code at the event for instant access, or share the link via social media and email. Guests can then browse the gallery, select their favorite photos, and complete a secure checkout.",
    },
    {
      question: "Can I make my fundraiser private?",
      answer:
        "Yes. When setting up your campaign, you have the option to make it password-protected. This ensures that only attendees with the password can view and purchase the photos, which is ideal for private events like weddings or family gatherings.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gray-900 overflow-hidden border-b-8 border-gray-100">
  
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/bg.png)" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        code Code
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           
            <div className="text-white z-10">
              <h1 className="text-1xl md:text-6xl font-bold leading-tight mb-6 text-shadow">
                Turn Photos
                <br />
                Into Purpose
              </h1>
              <p className="text-lg text-gray-200 mb-8 max-w-lg">
                Connect photographers, communities, and causes through beautiful
                imagery. Every download supports the missions that matter most.
              </p>

             
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/create-campaign"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-md font-semibold transition-transform hover:scale-105 text-center flex items-center justify-center space-x-2"
                >
                  <span>Start New Fundraiser</span>
                  <span className="font-bold text-lg">»</span>
                </Link>
                <Link
                  to="/browse"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-md font-semibold transition-transform hover:scale-105 text-center flex items-center justify-center space-x-2"
                >
                  <span>Browse Fundraiser</span>
                  <span className="font-bold text-lg">»</span>
                </Link>
              </div>

              
              <div className="flex flex-wrap gap-3">
                {[
                  "Family Portrait",
                  "Wedding photo",
                  "Commercial Photography",
                  "Photo Product",
                ].map((tag) => (
                  <div
                    key={tag}
                    className="border border-white border-opacity-40 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm bg-black bg-opacity-10"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

           
            <div className="relative h-96 flex items-center justify-center">
              
              <div className="absolute w-60 h-80 bg-white rounded-lg shadow-2xl transform rotate-12 translate-x-12">
                <img
                  src="/images/card-pumpkin.png"
                  alt="Pumpkin"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            
              <div className="absolute w-60 h-80 bg-white rounded-lg shadow-2xl transform -rotate-12 -translate-x-12">
                <img
                  src="/images/card-fireworks.png"
                  alt="Fireworks"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="absolute w-64 h-80 bg-white rounded-lg shadow-2xl z-10">
                <img
                  src="/images/card-cat.png"
                  alt="Cat"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            
              <div className="absolute bg-white p-4 rounded-lg shadow-2xl z-20 w-64 -bottom-16">
                <p className="text-gray-700 text-sm">
                  We capture precious moments in your life with an artistic and
                  professional touch. From family portraits to personal photo
                  sessions, we ensure every shot is a work of art that tells
                  your story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24" style={{ backgroundColor: "#E9EBED" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
            <div className="flex flex-col justify-between">
          
              <div className="pt-4">
                <p className="text-gray-700 text-lg leading-relaxed max-w-md">
                  Showcase your brand with high-quality, custom photos. Create a
                  campaign now and captivate your audience with stunning visuals
                  that make an impact.
                </p>
              </div>

          
              <div>
                <Link
                  to="/create-campaign"
                  className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105 space-x-2 text-sm"
                >
                  <span>Start New Fundraiser</span>
                  <span className="font-bold text-lg">»</span>
                </Link>
              </div>
            </div>

      
            <div>
              <h2
                className="text-4xl md:text-6xl font-light text-gray-800 mb-8 leading-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Create and Launch Your Visual Campaign with Stunning Photos
                Today
              </h2>
              <div className="relative">
                <img
                  src="/images/campaign-image.png" 
                  alt="Photographers at sunset"
                  className="rounded-2xl shadow-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-light text-gray-800 leading-tight max-w-2xl">
              Discover beautiful photography while supporting meaningful causes
              in communities around the world.
            </h2>
            <Link
              to="/browse"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center space-x-2 text-sm flex-shrink-0"
            >
              <span>Browse Fundraiser</span>
              <span className="font-bold text-lg">»</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
            <div className="bg-white rounded-2xl overflow-hidden group">
              <div className="relative">
                <img
                  src="/images/campaign-gala.png"
                  alt="Annual Charity Gala"
                  className="w-full h-72 object-cover rounded-2xl"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    12 Photos
                  </span>
                  <span className="bg-black/30 text-white px-4 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    Education
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Annual Charity Gala
                  </h3>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-lg font-bold text-gray-800">
                      $3,450
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Downtown Convention Center</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Sarah Johnson Photography</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>2/15/2025</span>
                  </div>
                </div>
              </div>
            </div>

        
            <div className="bg-white rounded-2xl overflow-hidden group">
              <div className="relative">
                <img
                  src="/images/campaign-race.png"
                  alt="Community 5K Race"
                  className="w-full h-72 object-cover rounded-2xl"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    10 Photos
                  </span>
                  <span className="bg-black/30 text-white px-4 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    Health & Wellness
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Community 5K Race
                  </h3>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-lg font-bold text-gray-800">
                      $3,450
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Riverside Park</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Mike Chen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>3/10/2025</span>
                  </div>
                </div>
              </div>
            </div>

        
            <div className="bg-white rounded-2xl overflow-hidden group">
              <div className="relative">
                <img
                  src="/images/campaign-pet.png"
                  alt="Pet Rescue Portrait"
                  className="w-full h-72 object-cover rounded-2xl"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    14 Photos
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Pet Rescue Portrait
                  </h3>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-lg font-bold text-gray-800">
                      $3,450
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Sunny Acres Animal Shelter</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Emma Rodriguez</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>2/15/2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 leading-tight">
              Photography That Makes a{" "}
              <span className="text-orange-500">Difference</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Empowering photographers and communities to create beautiful
              images while supporting meaningful causes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Professional Photography
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                High-quality photo management and delivery platform built for
                photographers who care about their craft and community impact.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Support Causes
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Direct integration with Every.org and custom charity options.
                Every photo download can support the causes you care about most.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Flexible Pricing
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Set your own pricing models - fixed rates, suggested donations,
                or pay-what-you-can. Split payments between photographers &
                causes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Community Driven
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Built for events that bring people together - from charity galas
                to community 5Ks, mission trips to family celebrations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Easy Sharing
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                QR codes, direct links, and social sharing tools make it simple
                for supporters to find and purchase photos from your event.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Secure & Trusted
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Bank-level security with Stripe payment processing. Transparent
                fee structure and detailed reporting for all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 leading-tight">
              Trusted by <span className="text-orange-500">Communities</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              See how photographers, nonprofits, and event organizers are using
              GoodPix to create impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
            <div>
              <img
                src="/images/quote-icon.svg"
                alt="Quote"
                className="mx-auto mb-6 h-10"
              />
              <p className="text-gray-700 mb-8 leading-relaxed font-light text-base">
                "GoodPix has transformed how I approach charity events. The
                split payment system means I can support causes I believe in
                while still making a living from my photography."
              </p>
              <div className="flex items-center justify-center">
                <img
                  src="/images/Sarah.jpg"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Event Photographer</p>
                </div>
              </div>
            </div>

          
            <div>
              <img
                src="/images/quote-icon.svg"
                alt="Quote"
                className="mx-auto mb-6 h-10"
              />
              <p className="text-gray-700 mb-8 leading-relaxed font-light text-base">
                "We raised an additional $3,000 for our youth programs just from
                event photo sales. The platform made it incredibly easy for
                attendees to purchase and donate."
              </p>
              <div className="flex items-center justify-center">
                <img
                  src="/images/Michael.jpg"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <p className="text-sm text-gray-500">Nonprofit Director</p>
                </div>
              </div>
            </div>

          
            <div>
              <img
                src="/images/quote-icon.svg"
                alt="Quote"
                className="mx-auto mb-6 h-10"
              />
              <p className="text-gray-700 mb-8 leading-relaxed font-light text-base">
                "The QR code sharing feature was a game-changer for our 5K race.
                Participants could instantly access their photos and many chose
                to add donations to our cause."
              </p>
              <div className="flex items-center justify-center">
                <img
                  src="/images/Emma.jpg"
                  alt="Emma Rodriguez"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Emma Rodriguez</p>
                  <p className="text-sm text-gray-500">Community Organizer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Everything you need to know about using GoodPix for your
              photography fundraising needs.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <button
                  className="flex items-center justify-between w-full text-left group"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-medium text-gray-800 pr-4">
                    {item.question}
                  </span>
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-orange-600 transition-colors">
                    <span
                      className={`text-white text-2xl font-light transform transition-transform ${
                        openFaq === index ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </div>
                </button>
               
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? "max-h-96 mt-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed pr-12">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    
    </div>
  );
};
export default HomePage;
