import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, MapPin, Camera, Calendar } from "lucide-react";

import { useCampaigns } from "../hooks/useCampaigns";
import CampaignCard from "../components/CampaignCard";

const CampaignCardPlaceholder: React.FC = () => (
    <div className="bg-white rounded-2xl overflow-hidden group">
        <div className="relative">
            <div className="w-full h-72 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
        <div className="pt-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
        </div>
    </div>
);

const HomePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: campaigns = [], isLoading } = useCampaigns();

 
  const imageCards = [
    { 
      id: 'cat', 
      src: '/images/card-cat.png', 
      alt: 'Cat', 
      text: 'We capture precious moments in your life with an artistic and professional touch. From family portraits to personal photo sessions.' 
    },
    { 
      id: 'fireworks', 
      src: '/images/card-fireworks.png', 
      alt: 'Fireworks',
      text: 'Celebrate your biggest events with vibrant, professional photography that captures the magic of the moment.'
    },
    { 
      id: 'pumpkin', 
      src: '/images/card-pumpkin.png', 
      alt: 'Pumpkin',
      text: 'Create lasting family memories with our fun and festive seasonal photoshoots. Perfect for all ages.'
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % imageCards.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  const faqData = [
      { question: "How does the payment splitting work?", answer: "Our platform uses Stripe Connect..." },
      { question: "What types of events work best with GoodPix?", answer: "GoodPix is perfect for any event..." },
      { question: "Do I need to be a professional photographer to use this?", answer: "Not at all!..." },
      { question: "How do people find and purchase photos?", answer: "Each fundraiser gets a unique, shareable link..." },
      { question: "Can I make my fundraiser private?", answer: "Yes. When setting up your campaign..." },
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

            <div className="relative h-96 w-full flex items-center justify-center group [perspective:1000px]">
              <div className="relative w-72 h-96 transition-transform duration-700" style={{ transformStyle: 'preserve-3d' }}>
                {imageCards.map((card, index) => {
                  const isFront = index === activeIndex;
                  const isRight = (activeIndex + 1) % imageCards.length === index;
                  const isLeft = (activeIndex - 1 + imageCards.length) % imageCards.length === index;

                  let transform = 'scale(0.8)';
                  let zIndex = 1;
                  let opacity = 0;

                  if (isFront) {
                    transform = 'translateZ(0px) scale(1)';
                    zIndex = 3;
                    opacity = 1;
                  } else if (isRight) {
                    transform = 'translateX(40%) scale(0.9) translateZ(-50px)';
                    zIndex = 2;
                    opacity = 1;
                  } else if (isLeft) {
                    transform = 'translateX(-40%) scale(0.9) translateZ(-50px)';
                    zIndex = 1;
                    opacity = 1;
                  }

                  const styles = { transform, zIndex, opacity };

                  return (
                    <div
                      key={card.id}
                      className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl transition-all duration-500 ease-in-out overflow-hidden"
                      style={styles}
                    >
                      <img
                        src={card.src}
                        alt={card.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 w-full bg-white p-4">
                        <p className="text-gray-700 text-sm">
                          {card.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
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

      {/* --- STEP 3: THIS IS THE ONLY SECTION THAT HAS BEEN MODIFIED --- */}
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
            {isLoading ? (
              // If data is loading, show 3 placeholders
              <>
                <CampaignCardPlaceholder />
                <CampaignCardPlaceholder />
                <CampaignCardPlaceholder />
              </>
            ) : (
              // Otherwise, show the latest 3 campaigns from the database
              campaigns
                .slice(0, 3)
                .map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))
            )}
            {!isLoading && campaigns.length === 0 && (
              <p className="col-span-3 text-center text-gray-500">
                No active campaigns found.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ALL SECTIONS BELOW THIS ARE UNCHANGED */}
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
