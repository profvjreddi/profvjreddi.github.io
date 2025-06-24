import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lightbulb, Link2 } from 'lucide-react';
import { getCachedPublications } from '../utils/dblpCache';

interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: string;
  url?: string;
  ee?: string;
  areas?: string[];
}

// Classification system for 3 core research areas
const classifyPublication = (publication: Publication): string[] => {
  const title = publication.title.toLowerCase();
  const venue = publication.venue.toLowerCase();
  
  const areas = {
    'Computer Architecture': [
      'architecture', 'processor', 'cpu', 'gpu', 'hardware', 'memory', 'cache',
      'accelerator', 'chip', 'silicon', 'fpga', 'asic', 'microarchitecture',
      'performance', 'energy', 'power', 'multicore', 'parallel', 'embedded',
      'mobile', 'iot', 'edge computing'
    ],
    'Machine Learning Systems': [
      'machine learning', 'ml', 'deep learning', 'neural', 'ai', 'artificial intelligence',
      'tinyml', 'inference', 'training', 'model', 'benchmark', 'mlperf',
      'distributed learning', 'framework', 'system', 'edge ai', 'dataset'
    ],
    'Autonomous Agents': [
      'autonomous', 'robot', 'robotics', 'agent', 'uav', 'drone', 'control',
      'navigation', 'planning', 'safety', 'fault', 'real-time', 'multi-agent',
      'coordination', 'decision making', 'embodied', 'ros'
    ]
  };
  
  const matchedAreas: string[] = [];
  
  for (const [area, keywords] of Object.entries(areas)) {
    let score = 0;
    for (const keyword of keywords) {
      if (title.includes(keyword)) score += 3;
      if (venue.includes(keyword)) score += 1;
    }
    if (score >= 2) {
      matchedAreas.push(area);
    }
  }
  
  return matchedAreas.length > 0 ? matchedAreas : ['Machine Learning Systems'];
};

function Research() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPublications = async () => {
    try {
      setLoading(true);
      const pubs = await getCachedPublications();
      const classifiedPubs = pubs.map(pub => ({
        ...pub,
        areas: classifyPublication(pub)
      }));
      setPublications(classifiedPubs);
    } catch (err) {
      console.error('Error loading publications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, []);

  const getRecentPublicationsForArea = (area: string) => {
    return publications
      .filter(pub => pub.areas?.includes(area))
      .sort((a, b) => b.year - a.year)
      .slice(0, 3);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAllSections = () => {
    const allSections = ['2024-present', '2019-2024', '2013-2018', '2008-2013', '2003-2008'];
    if (expandedSections.length === allSections.length) {
      setExpandedSections([]);
    } else {
      setExpandedSections(allSections);
    }
  };

  const allExpanded = expandedSections.length === 5;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Research</h1>
            <div className="w-24 h-1 bg-[#A51C30]"></div>
            <p className="text-lg text-gray-600 mt-6 max-w-3xl">
              Advancing intelligence at the edge—from sensors to autonomous systems—through integrated hardware and software co-design, algorithmic innovation, and embodied decision-making.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Research Areas */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Research Areas</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Computer Architecture */}
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-[#A51C30] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Computer Architecture</h3>
                <p className="text-gray-600 mb-4">
                  Building efficient and reliable computing systems from the ground up.
                </p>
                <ul className="text-sm text-gray-500 space-y-1 mb-6">
                  <li>• Energy-efficient processors</li>
                  <li>• Memory system optimization</li>
                  <li>• Hardware-software co-design</li>
                  <li>• Performance analysis</li>
                </ul>
                
                <Link 
                  to="/publications?area=Computer Architecture"
                  className="text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium inline-block"
                >
                  View all Computer Architecture publications →
                </Link>
              </motion.div>

              {/* ML Systems */}
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-[#A51C30] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Machine Learning Systems</h3>
                <p className="text-gray-600 mb-4">
                  Combining machine learning with systems research for intelligent edge computing.
                </p>
                <ul className="text-sm text-gray-500 space-y-1 mb-6">
                  <li>• TinyML and edge inference</li>
                  <li>• Runtime optimization</li>
                  <li>• ML benchmarking</li>
                  <li>• Data-centric AI systems</li>
                </ul>
                
                <Link 
                  to="/publications?area=Machine Learning Systems"
                  className="text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium inline-block"
                >
                  View all Machine Learning Systems publications →
                </Link>
              </motion.div>

              {/* Autonomous Agency */}
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-[#A51C30] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Autonomous Agents</h3>
                <p className="text-gray-600 mb-4">
                  Building intelligent systems that can adapt and operate safely in real-world environments.
                </p>
                <ul className="text-sm text-gray-500 space-y-1 mb-6">
                  <li>• Safety-critical systems</li>
                  <li>• Real-time adaptation</li>
                  <li>• Embodied AI</li>
                  <li>• Generative co-design</li>
                </ul>
                
                <Link 
                  to="/publications?area=Autonomous Agents"
                  className="text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium inline-block"
                >
                  View all Autonomous Agents publications →
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Research Evolution */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Research Evolution</h2>
              <button
                onClick={toggleAllSections}
                className="inline-flex items-center text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium transition-colors border border-[#A51C30] hover:border-[#8B1A2B] px-3 py-2 rounded-lg"
              >
                <svg 
                  className={`w-4 h-4 mr-2 transition-transform ${allExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {allExpanded ? 'Hide All Details' : 'Show All Details'}
              </button>
            </div>
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-12">
                {/* 2024-Present */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute left-2 top-8 flex flex-col items-center">
                    <div className="bg-[#A51C30] text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm">
                      2024
                    </div>
                  </div>
                  <div className="ml-20 bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Embodied & Generative AI Systems</h3>
                      </div>
                      <span className="text-xs text-white bg-[#A51C30] px-3 py-1 rounded-full font-medium">
                        Current Focus
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Designing systems that enable autonomous agents to operate safely and efficiently in the real world, 
                      while exploring generative approaches for automating system behavior and architecture design.
                    </p>
                    <button
                      onClick={() => toggleSection('2024-present')}
                      className="inline-flex items-center text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium transition-colors group"
                    >
                      <svg 
                        className={`w-4 h-4 mr-2 transition-transform ${expandedSections.includes('2024-present') ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Key Contributions
                    </button>
                    {expandedSections.includes('2024-present') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <p className="text-sm text-gray-700 mb-4 italic font-medium">
                          <strong className="text-gray-900">Approach:</strong> Treats embodied and generative intelligence as a converged systems problem—requiring coordination across runtime adaptation, physical interaction, and automated system synthesis.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-3">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Adaptive execution frameworks for agents interacting with real-world environments
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Safety–efficiency tradeoffs in runtime autonomy for robotics and embodied platforms
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Generative methods for hardware/software co-design (e.g., automated pipeline or chip synthesis)
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Toolchains that support real-time perception, actuation, and feedback loops
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Evaluation frameworks for intelligent physical systems in safety-critical and uncertain conditions
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* 2019-2024 */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="absolute left-2 top-8 flex flex-col items-center">
                    <div className="bg-gray-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm">
                      2019
                    </div>
                  </div>
                  <div className="ml-20 bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Machine Learning Systems</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Combined machine learning with systems expertise to bring AI inference to microcontrollers and ultra-low-power devices. 
                      This work helped democratize AI and established reproducible ML benchmarking standards.
                    </p>
                    <button
                      onClick={() => toggleSection('2019-2024')}
                      className="inline-flex items-center text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium transition-colors group"
                    >
                      <svg 
                        className={`w-4 h-4 mr-2 transition-transform ${expandedSections.includes('2019-2024') ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Key Contributions
                    </button>
                    {expandedSections.includes('2019-2024') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <p className="text-sm text-gray-700 mb-4 italic font-medium">
                          <strong className="text-gray-900">Approach:</strong> Positioned ML deployment as a full-stack systems problem—emphasizing runtime efficiency, hardware awareness, and data quality over model-centric design alone.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-3">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            TensorFlow Lite Micro, a widely adopted framework for embedded ML inference
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            MLPerf Tiny and Inference, setting industry-wide benchmarking standards
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            DataPerf, shifting focus to data quality as a central axis of performance
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Compiler/runtime stacks for energy- and memory-constrained AI execution
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Bridged ML and systems communities by translating research into industry-usable tooling and metrics
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* 2013-2018 */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="absolute left-2 top-8 flex flex-col items-center">
                    <div className="bg-gray-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm">
                      2013
                    </div>
                  </div>
                  <div className="ml-20 bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile & Embedded Computing</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Focused on real-time performance and energy efficiency in mobile and embedded platforms, while beginning to explore mission-aware systems. 
                      This work laid the groundwork for edge intelligence in physical environments.
                    </p>
                    <button
                      onClick={() => toggleSection('2013-2018')}
                      className="inline-flex items-center text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium transition-colors group"
                    >
                      <svg 
                        className={`w-4 h-4 mr-2 transition-transform ${expandedSections.includes('2013-2018') ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Key Contributions
                    </button>
                    {expandedSections.includes('2013-2018') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <p className="text-sm text-gray-700 mb-4 italic font-medium">
                          <strong className="text-gray-900">Approach:</strong> Treated resource constraints not as limitations but as system-level design primitives, with a focus on responsiveness, low-latency interaction, and mission-aligned execution.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-3">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Event-driven and reactive systems for deeply embedded platforms
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Mobile browser execution stacks (e.g., WebKit, JavaScript scheduling) for user responsiveness
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Latency-aware scheduling frameworks for heterogeneous mobile SoCs
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Real-time compute pipelines for UAVs and autonomous systems under resource limits
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Full-system power-performance tradeoffs in mobile and IoT use cases
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* 2008-2013 */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="absolute left-2 top-8 flex flex-col items-center">
                    <div className="bg-gray-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm">
                      2008
                    </div>
                  </div>
                  <div className="ml-20 bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Processor Architecture</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Expanded into understanding how systems fail and how to build robust, energy-efficient computing platforms. 
                      This work on reliability and power optimization became essential as computing moved into battery-powered and safety-critical applications.
                    </p>
                    <button
                      onClick={() => toggleSection('2008-2013')}
                      className="inline-flex items-center text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium transition-colors group"
                    >
                      <svg 
                        className={`w-4 h-4 mr-2 transition-transform ${expandedSections.includes('2008-2013') ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Key Contributions
                    </button>
                    {expandedSections.includes('2008-2013') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <p className="text-sm text-gray-700 mb-4 italic font-medium">
                          <strong className="text-gray-900">Approach:</strong> Redefined architectural reliability and energy efficiency as a coordination problem spanning compiler, runtime, and hardware, enabling adaptation to environmental and workload variability.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-3">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            DVFS control strategies for multicore CPUs and GPUs under thermal and power constraints
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Hardware variability (e.g., process variation, voltage noise) and its impact on execution quality
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Compiler–architecture protocols for fault-aware instruction scheduling and state management
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Graceful degradation mechanisms under energy and fault conditions
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Reliability-performance-energy tradeoffs at the system level
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* 2003-2008 */}
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="absolute left-2 top-8 flex flex-col items-center">
                    <div className="bg-gray-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm">
                      2003
                    </div>
                  </div>
                  <div className="ml-20 bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Compilers</h3>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Started with compiler optimizations and performance analysis, focusing on how software and hardware interact to achieve optimal execution. 
                      This foundation in understanding the full computing stack became crucial for all subsequent work.
                    </p>
                    <button
                      onClick={() => toggleSection('2003-2008')}
                      className="inline-flex items-center text-sm text-[#A51C30] hover:text-[#8B1A2B] font-medium transition-colors group"
                    >
                      <svg 
                        className={`w-4 h-4 mr-2 transition-transform ${expandedSections.includes('2003-2008') ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Key Contributions
                    </button>
                    {expandedSections.includes('2003-2008') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <p className="text-sm text-gray-700 mb-4 italic font-medium">
                          <strong className="text-gray-900">Approach:</strong> Framed compilation as a dynamic, system-aware process—moving beyond static optimization to design tooling that integrates tightly with runtime behavior and architectural context.
                        </p>
                        <ul className="text-sm text-gray-600 space-y-3">
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Pin, a dynamic binary instrumentation framework widely used in research and industry
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Persistent code caching to accelerate dynamic introspection and profiling
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Hardware-aware code generation, enabling improved performance and architectural alignment
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Tools that connected program analysis to hardware simulation and runtime feedback
                          </li>
                          <li className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            Execution-time introspection to support adaptive program transformation
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Research Synthesis Section */}
          <div className="relative max-w-4xl mx-auto mt-12">
              <div className="absolute left-8 top-0 h-16 w-0.5 bg-gray-200" aria-hidden="true"></div>
              <div className="relative">
                  <div className="absolute left-8 top-8 transform -translate-x-1/2 z-10 hidden md:block">
                      <div className="bg-[#A51C30] p-3 rounded-full shadow-md">
                          <Link2 className="text-white h-6 w-6" />
                      </div>
                  </div>
                  <div className="ml-0 md:ml-20 bg-white rounded-2xl shadow-lg border-2 border-[#A51C30] p-10 relative">
                      <div className="absolute top-8 right-8">
                          <div className="bg-[#A51C30] p-3 rounded-full shadow-md">
                              <Lightbulb className="text-white h-6 w-6" />
                          </div>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Research Synthesis</h2>
                      <p className="text-lg text-[#A51C30] font-semibold mt-1 mb-6">How It All Connects</p>
                      <p className="text-gray-700 max-w-4xl leading-relaxed mb-10">
                        Each research phase built systematically toward intelligent systems that can operate
                        autonomously in the real world. From dynamic compilation tools to embodied AI, the common
                        thread is treating complex systems as coordination problems that span multiple layers of the
                        computing stack.
                      </p>
                      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                          <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">Core Principles</h3>
                              <ul className="space-y-3">
                                  <li className="flex items-start">
                                      <div className="w-2 h-2 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <p className="text-gray-600"><strong className="text-gray-800">Systems thinking:</strong> Every problem spans hardware, software, and runtime</p>
                                  </li>
                                  <li className="flex items-start">
                                      <div className="w-2 h-2 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <p className="text-gray-600"><strong className="text-gray-800">Adaptive execution:</strong> Systems must respond to changing conditions</p>
                                  </li>
                                  <li className="flex items-start">
                                      <div className="w-2 h-2 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <p className="text-gray-600"><strong className="text-gray-800">Real-world deployment:</strong> Research must translate to practical impact</p>
                                  </li>
                              </ul>
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">Evolution Path</h3>
                              <ul className="space-y-3">
                                  <li className="flex items-start">
                                      <div className="w-2 h-2 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <p className="text-gray-600"><strong className="text-gray-800">Foundation:</strong> Dynamic instrumentation and runtime adaptation</p>
                                  </li>
                                  <li className="flex items-start">
                                      <div className="w-2 h-2 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <p className="text-gray-600"><strong className="text-gray-800">Scaling:</strong> Energy-aware systems for mobile and embedded platforms</p>
                                  </li>
                                  <li className="flex items-start">
                                      <div className="w-2 h-2 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <p className="text-gray-600"><strong className="text-gray-800">Intelligence:</strong> ML systems that bridge research and deployment</p>
                                  </li>
                                  <li className="flex items-start">
                                      <div className="w-2 h-2 bg-[#A51C30] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      <p className="text-gray-600"><strong className="text-gray-800">Autonomy:</strong> Embodied systems that act safely in the real world</p>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Interested in Collaboration */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Collaboration?</h2>
            <p className="text-gray-600 mb-6">
              I'm always open to discussing research opportunities and potential collaborations.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center bg-[#A51C30] text-white px-6 py-3 rounded-lg hover:bg-[#8B1A2B] transition-colors font-medium"
            >
              Get in Touch
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Research;