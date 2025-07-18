function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              {/* Header Text */}
              <div className="flex-grow">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile</h1>
                <div className="w-24 h-1 bg-[#A51C30] mb-4"></div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Prof. Vijay Janapa Reddi</h2>
                  <p className="text-lg text-gray-600 mb-1">Gordon McKay Professor</p>
                  <p className="text-gray-500">Harvard University School of Engineering and Applied Sciences</p>
                </div>
              </div>
              
              {/* Photo */}
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <img
                  src={process.env.NODE_ENV === 'production' ? '/homepage/images/profile.jpg' : '/images/profile.jpg'}
                  alt="Prof. Vijay Janapa Reddi"
                  className="w-32 h-32 rounded-xl object-cover shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Prof. Vijay Janapa Reddi is a Gordon McKay Professor of Engineering and Applied Sciences at Harvard University, 
                where his research focuses on the intersection of computer architecture, machine learning systems, and autonomous agents. 
                His multidisciplinary expertise drives advancements in efficient and intelligent computing systems across scales, 
                from mobile and edge platforms to Internet of Things (IoT) devices.
              </p>
              
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                <strong>Dr. Prof. Janapa Reddi is widely recognized for his pioneering contributions to the field</strong>, including 
                developing the emerging field of Tiny Machine Learning (TinyML) and co-leading the creation of MLPerf, 
                the industry-standard benchmarking suite that evaluates machine learning systems from megawatt to microwatt scales. 
                These foundational works have shaped how the industry approaches efficient AI deployment and performance measurement.
              </p>

              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                In addition to his academic role, Dr. Prof. Janapa Reddi is deeply involved in shaping the future of machine learning 
                and edge AI technologies. He serves as Vice President and co-founder of MLCommons, a nonprofit organization 
                dedicated to accelerating machine learning innovation. He also serves on the boards of directors for the 
                EDGE AI Foundation, fostering academic-industry partnerships at the edge of AI.
              </p>

              <p className="text-lg leading-relaxed text-gray-700">
                Dr. Prof. Janapa Reddi is passionate about expanding access to applied machine learning and promoting diversity in STEM. 
                His open-source book <a href="https://mlsysbook.ai" target="_blank" rel="noopener noreferrer" className="text-[#A51C30] hover:text-[#8B1A2B] font-medium">"Machine Learning Systems"</a> is widely adopted by institutions worldwide, 
                and his <a href="https://www.edx.org/professional-certificate/harvardx-tiny-machine-learning" target="_blank" rel="noopener noreferrer" className="text-[#A51C30] hover:text-[#8B1A2B] font-medium">Tiny Machine Learning (TinyML) series on edX</a> has trained over 100,000 students globally, 
                democratizing access to cutting-edge AI education.
              </p>
            </div>

            {/* Pioneering Contributions Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pioneering Contributions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-[#A51C30] mb-2">Tiny Machine Learning (TinyML)</h3>
                  <p className="text-gray-600">Developed and pioneered the field of TinyML, enabling AI on ultra-low-power devices and IoT systems.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-[#A51C30] mb-2">MLPerf Benchmarks</h3>
                  <p className="text-gray-600">Co-led the development of MLPerf, the industry-standard benchmarking suite for ML systems across all scales.</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-gray-900">Ph.D. in Computer Science</span>
                  <span className="text-gray-600">Harvard University</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-gray-900">M.S. in Electrical and Computer Engineering</span>
                  <span className="text-gray-600">University of Colorado at Boulder</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="font-semibold text-gray-900">B.S. in Computer Engineering</span>
                  <span className="text-gray-600">Santa Clara University</span>
                </div>
              </div>
            </div>

            {/* Key Roles */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Roles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">MLCommons</h3>
                  <p className="text-gray-600">Vice President and Co-founder</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">EDGE AI Foundation</h3>
                  <p className="text-gray-600">Board of Directors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Contact Information */}
          <div className="bg-[#A51C30]/5 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact & CV</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 mb-4">
                  For detailed information about publications, awards, and professional experience, 
                  please refer to my curriculum vitae.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={process.env.NODE_ENV === 'production' ? '/homepage/documents/cv.pdf' : '/documents/cv.pdf'} 
                  className="inline-flex items-center px-6 py-3 bg-[#A51C30] text-white font-medium rounded-lg hover:bg-[#8B1A2B] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download CV
                </a>
                <a 
                  href="mailto:vijay@seas.harvard.edu" 
                  className="inline-flex items-center px-6 py-3 border border-[#A51C30] text-[#A51C30] font-medium rounded-lg hover:bg-[#A51C30]/5 transition-colors"
                >
                  Email Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;