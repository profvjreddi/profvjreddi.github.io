import { Link } from 'react-router-dom';
import Updates from '../components/Updates';

function Home() {
  return (
    <div className="bg-white">
      <div className="relative bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#A51C30] text-white">
                  Harvard University
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Advancing the Future of 
                <span className="text-[#A51C30]"> AI Systems</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Research at the intersection of computer architecture, machine learning systems, 
                and autonomous agents, building the computational foundations from TinyML to the Edge of AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/research" className="bg-[#A51C30] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#8B1A2B] transition-colors text-center">
                  View Research
                </Link>
                <Link to="/publications" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center">
                  Recent Publications
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <Updates maxItems={3} homeStyle={true} />
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Focus Areas</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Exploring the computational challenges and opportunities in modern AI systems
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#A51C30] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Computer Architecture</h3>
              <p className="text-gray-600">
                Designing efficient hardware architectures for AI workloads and next-generation computing systems.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#A51C30] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Machine Learning Systems</h3>
              <p className="text-gray-600">
                Building scalable, efficient systems for training and deploying machine learning models at scale.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#A51C30] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Autonomous Agents</h3>
              <p className="text-gray-600">
                Developing intelligent agents that can learn, adapt, and make decisions in complex environments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;