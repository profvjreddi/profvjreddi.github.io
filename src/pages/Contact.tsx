function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
            <div className="w-24 h-1 bg-[#A51C30]"></div>
            <p className="text-lg text-gray-600 mt-6">
              I welcome thoughtful inquiries from students, researchers, industry partners, and media. 
              Please review the guidelines below to ensure effective communication.
            </p>
          </div>

          {/* Contact Guidelines */}
          <div className="bg-[#A51C30]/5 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Before You Reach Out</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Please do your homework first.</strong> I receive many inquiries daily, and I can provide the most helpful response when you've taken time to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Review my research areas and recent publications</li>
                <li>Explore my teaching materials and course offerings</li>
                <li>Check if your question is already answered on this website</li>
                <li>Be specific about what you're looking for or how I can help</li>
              </ul>
              <p className="text-gray-700">
                <strong>I do my best to reply to all thoughtful, well-researched inquiries.</strong>
              </p>
            </div>
          </div>

          {/* Scheduling Meetings */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule a Meeting</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Book Time Directly</h3>
                  <p className="text-gray-700 mb-4">
                    For meeting requests, please use my scheduling system to find available times. 
                    This helps streamline the process and ensures we can connect efficiently.
                  </p>
                  <p className="text-sm text-gray-600">
                    Please include a brief agenda or purpose for our meeting when booking.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a 
                    href="https://fantastical.app/vjreddi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-[#A51C30] text-white font-medium rounded-lg hover:bg-[#8B1A2B] transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule Meeting
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Contact Methods */}
          <div id="contact-methods" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Methods</h2>
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Email */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-[#A51C30] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Direct Email</h3>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  For research inquiries, collaboration opportunities, and general questions.
                </p>
                <div className="text-[#A51C30] hover:text-[#8B1A2B] font-medium">
                  <span>vj</span>
                  <span style={{display: 'none'}}>nospam</span>
                  <span>@</span>
                  <span style={{display: 'none'}}>removethis</span>
                  <span>eecs</span>
                  <span>.</span>
                  <span>harvard</span>
                  <span>.</span>
                  <span>edu</span>
                </div>
              </div>

              {/* Administrative Contact */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-[#A51C30] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Assistant</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600 mb-2">
                    <strong>Sarah Gayer</strong><br />
                    Administrative Coordinator
                  </p>
                  <p className="text-gray-600 mb-4">
                    For scheduling, logistics, and administrative matters.
                  </p>
                </div>
                <div className="text-[#A51C30] hover:text-[#8B1A2B] font-medium">
                  <span>sgayer</span>
                  <span style={{display: 'none'}}>nospam</span>
                  <span>@</span>
                  <span style={{display: 'none'}}>removethis</span>
                  <span>g</span>
                  <span>.</span>
                  <span>harvard</span>
                  <span>.</span>
                  <span>edu</span>
                </div>
              </div>

              {/* Office */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-[#A51C30] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Office</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600 mb-2">
                    150 Western Ave, #5.305<br />
                    Boston, MA 02134<br />
                    Harvard University
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Please schedule meetings in advance using the link above
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry Types */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Inquiries</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-[#A51C30] mb-2">Prospective Students</h3>
                <p className="text-sm text-gray-600">
                  PhD, postdoc, and visiting researcher opportunities
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-[#A51C30] mb-2">Research Collaboration</h3>
                <p className="text-sm text-gray-600">
                  Academic partnerships and joint research projects
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-[#A51C30] mb-2">Industry Partnerships</h3>
                <p className="text-sm text-gray-600">
                  Consulting, advisory roles, and technology transfer
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-[#A51C30] mb-2">Speaking & Media</h3>
                <p className="text-sm text-gray-600">
                  Conference talks, interviews, and media requests
                </p>
              </div>
            </div>
          </div>

          {/* Response Expectations */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Expectations</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What to Expect</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• I aim to respond within 1-2 weeks</li>
                  <li>• Detailed inquiries receive priority</li>
                  <li>• I may suggest alternative resources if appropriate</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How to Help Me Help You</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Be specific about your request</li>
                  <li>• Include relevant background information</li>
                  <li>• Suggest 2-3 meeting time options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;