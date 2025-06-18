import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/background-effects.css';

export function Homepage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const pages = [
    {
      id: 'welcome',
      title: 'Welcome to Tribe',
      subtitle: 'Your Gateway to Meaningful Communities and Lifelong Connections',
      cards: [
        { title: 'Active Clubs', count: '247', color: 'from-blue-500 to-blue-600' },
        { title: 'Events This Week', count: '200-42', color: 'from-red-400 to-red-500' },
        { title: 'New Connections', count: '200-42', color: 'from-green-400 to-green-500' },
        { title: 'Opportunities', count: '200-42', color: 'from-yellow-400 to-yellow-500' }
      ]
    },
    {
      id: 'explore',
      title: 'Explore Clubs',
      subtitle: 'Discover communities that match your interests and passions',
      cards: [
        { title: 'Tech Clubs', count: '42', color: 'from-purple-500 to-purple-600' },
        { title: 'Sports Teams', count: '38', color: 'from-orange-400 to-orange-500' },
        { title: 'Arts & Culture', count: '29', color: 'from-pink-400 to-pink-500' },
        { title: 'Academic', count: '51', color: 'from-indigo-400 to-indigo-500' }
      ]
    },
    {
      id: 'events',
      title: 'Upcoming Events',
      subtitle: 'Never miss out on exciting campus activities and opportunities',
      cards: [
        { title: 'This Week', count: '12', color: 'from-cyan-500 to-cyan-600' },
        { title: 'This Month', count: '67', color: 'from-emerald-400 to-emerald-500' },
        { title: 'Workshops', count: '8', color: 'from-violet-400 to-violet-500' },
        { title: 'Social Events', count: '15', color: 'from-rose-400 to-rose-500' }
      ]
    },
    {
      id: 'opportunities',
      title: 'Take Quiz',
      subtitle: 'Find your perfect club match with our personalized quiz',
      cards: [
        { title: 'Quiz Questions', count: '20', color: 'from-teal-500 to-teal-600' },
        { title: 'Club Matches', count: '85%', color: 'from-lime-400 to-lime-500' },
        { title: 'Success Rate', count: '92%', color: 'from-amber-400 to-amber-500' },
        { title: 'Happy Students', count: '1.2k', color: 'from-fuchsia-400 to-fuchsia-500' }
      ]
    }
  ];

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Determine current page based on scroll position
      const pageHeight = window.innerHeight;
      const newPage = Math.floor(window.scrollY / pageHeight);
      setCurrentPage(Math.min(newPage, pages.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pages.length]);

  // Navigate to specific page
  const navigateToPage = (pageIndex: number) => {
    const pageHeight = window.innerHeight;
    window.scrollTo({
      top: pageIndex * pageHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <div className="relative w-full h-full">
          <div className="absolute inset-0">
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
            <div className="firefly"></div>
          </div>
        </div>
      </div>

      {/* Fixed Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tribe
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#explore" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Explore Clubs
              </a>
              <a href="#events" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Events
              </a>
              <a href="#opportunities" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Opportunities
              </a>
              <a href="#quiz" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Take Quiz
              </a>
              <a href="#dashboard" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Dashboard
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                About us
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg
                  hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium
                  shadow-lg hover:shadow-xl"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg
                  hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Pages Container */}
      <div className="relative z-10">
        {pages.map((page, index) => (
          <section
            key={page.id}
            id={page.id}
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, 
                ${index === 0 ? 'rgba(240, 249, 255, 0.3), rgba(224, 242, 254, 0.3)' : 
                  index === 1 ? 'rgba(254, 243, 199, 0.3), rgba(254, 215, 170, 0.3)' :
                  index === 2 ? 'rgba(240, 253, 244, 0.3), rgba(220, 252, 231, 0.3)' :
                  'rgba(253, 244, 255, 0.3), rgba(252, 231, 243, 0.3)'})`
            }}
          >
            {/* Parallax Background Elements */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            >
              <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-orange-300/30 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-green-300/30 to-cyan-300/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h1 
                  className="text-6xl md:text-8xl font-bold text-gray-900 mb-6"
                  style={{
                    transform: `translateY(${(scrollY - index * window.innerHeight) * 0.2}px)`,
                  }}
                >
                  {page.title}
                </h1>
                <p 
                  className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto"
                  style={{
                    transform: `translateY(${(scrollY - index * window.innerHeight) * 0.15}px)`,
                  }}
                >
                  {page.subtitle}
                </p>
              </div>

              {/* Cards Grid */}
              <div 
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
                style={{
                  transform: `translateY(${(scrollY - index * window.innerHeight) * 0.1}px)`,
                }}
              >
                                 {page.cards.map((card, cardIndex) => (
                   <div
                     key={cardIndex}
                     className="group relative rounded-3xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
                     style={{
                       background: `linear-gradient(145deg, ${
                         index === 0 ? 'rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.9)' : 
                         index === 1 ? 'rgba(254, 252, 232, 0.9), rgba(254, 243, 199, 0.9)' :
                         index === 2 ? 'rgba(247, 254, 231, 0.9), rgba(236, 253, 245, 0.9)' :
                         'rgba(253, 242, 248, 0.9), rgba(250, 232, 255, 0.9)'
                       })`,
                       boxShadow: `
                         20px 20px 40px ${
                           index === 0 ? 'rgba(59, 130, 246, 0.15)' :
                           index === 1 ? 'rgba(251, 146, 60, 0.15)' :
                           index === 2 ? 'rgba(34, 197, 94, 0.15)' :
                           'rgba(236, 72, 153, 0.15)'
                         },
                         -20px -20px 40px rgba(255, 255, 255, 0.8)
                       `,
                       animationDelay: `${cardIndex * 0.1}s`,
                     }}
                   >
                     {/* Card Content */}
                     <div className="relative p-6 h-40">
                       {/* Icon Container - Neomorphic */}
                       <div 
                         className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center"
                         style={{
                           background: `linear-gradient(145deg, ${
                             index === 0 ? 'rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.9)' : 
                             index === 1 ? 'rgba(254, 252, 232, 0.9), rgba(254, 243, 199, 0.9)' :
                             index === 2 ? 'rgba(247, 254, 231, 0.9), rgba(236, 253, 245, 0.9)' :
                             'rgba(253, 242, 248, 0.9), rgba(250, 232, 255, 0.9)'
                           })`,
                           boxShadow: `
                             inset 8px 8px 16px ${
                               index === 0 ? 'rgba(59, 130, 246, 0.1)' :
                               index === 1 ? 'rgba(251, 146, 60, 0.1)' :
                               index === 2 ? 'rgba(34, 197, 94, 0.1)' :
                               'rgba(236, 72, 153, 0.1)'
                             },
                             inset -8px -8px 16px rgba(255, 255, 255, 0.9)
                           `
                         }}
                       >
                         <svg 
                           className="w-6 h-6" 
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24"
                           style={{
                             color: index === 0 ? '#3b82f6' :
                                    index === 1 ? '#fb923c' :
                                    index === 2 ? '#22c55e' :
                                    '#ec4899'
                           }}
                         >
                           {cardIndex === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-4 0H3m2-10h14m-5-2h3" />}
                           {cardIndex === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                           {cardIndex === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                           {cardIndex === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                         </svg>
                       </div>

                       {/* Card Title */}
                       <h3 className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wide">
                         {card.title}
                       </h3>

                       {/* Large Number */}
                       <div className="text-3xl font-bold text-gray-800 mb-1">
                         {card.count}
                       </div>

                       {/* Subtitle */}
                       <div className="text-xs text-gray-500">
                         Go to this week →
                       </div>

                       {/* Floating Arrow Button - Neomorphic */}
                       <div 
                         className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                         style={{
                           background: `linear-gradient(145deg, ${
                             index === 0 ? 'rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.9)' : 
                             index === 1 ? 'rgba(254, 252, 232, 0.9), rgba(254, 243, 199, 0.9)' :
                             index === 2 ? 'rgba(247, 254, 231, 0.9), rgba(236, 253, 245, 0.9)' :
                             'rgba(253, 242, 248, 0.9), rgba(250, 232, 255, 0.9)'
                           })`,
                           boxShadow: `
                             6px 6px 12px ${
                               index === 0 ? 'rgba(59, 130, 246, 0.15)' :
                               index === 1 ? 'rgba(251, 146, 60, 0.15)' :
                               index === 2 ? 'rgba(34, 197, 94, 0.15)' :
                               'rgba(236, 72, 153, 0.15)'
                             },
                             -6px -6px 12px rgba(255, 255, 255, 0.8)
                           `
                         }}
                       >
                         <svg 
                           className="w-4 h-4" 
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24"
                           style={{
                             color: index === 0 ? '#3b82f6' :
                                    index === 1 ? '#fb923c' :
                                    index === 2 ? '#22c55e' :
                                    '#ec4899'
                           }}
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                         </svg>
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </section>
        ))}
      </div>



      {/* Scroll Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col items-center space-y-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-12 rounded-full transition-all duration-300 ${
                currentPage === index
                  ? 'bg-white shadow-lg'
                  : 'bg-gray-300/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 