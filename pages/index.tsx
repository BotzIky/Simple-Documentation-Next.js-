import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { 
  IconApi, 
  IconBook, 
  IconCode, 
  IconBrandGithub,
  IconMenu2,
  IconX,
  IconSend,
  IconChevronRight,
  IconChevronDown,
  IconLoader2
} from '@tabler/icons-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/json';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

SyntaxHighlighter.registerLanguage('json', json);

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response: any;
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/dl/facebook',
    description: 'Downloader Facebook',
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'Facebook video URL'
      }
    ],
    response: {
      success: true,
      message: 'Video download URL retrieved successfully',
      data: {
        downloadUrl: 'https://dl.facebook.com/example'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/dl/spotify',
    description: 'Spotify track downloader',
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'Spotify url track'
      }
    ],
    response: {
      success: true,
      message: 'Download successful',
      data: {
        info: {},
        download: 'https://media.savetube.me/media-downloader-direct?url=https%3A%2F%2Fspotifymate.com'
      }
    }
  }
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [testResponse, setTestResponse] = useState<string>('');
  const [activeSection, setActiveSection] = useState('introduction');
  const [isLoading, setIsLoading] = useState(false);
  const [paramValues, setParamValues] = useState<{ [key: string]: string }>({});
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    gettingStarted: true,
    endpoints: true
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  const handleTest = async (endpoint: Endpoint) => {
    setIsLoading(true);
    setTestResponse('');

    try {
      let url = endpoint.path;
      if (endpoint.method === 'GET' && endpoint.parameters) {
        const queryParams = new URLSearchParams();
        endpoint.parameters.forEach(param => {
          if (paramValues[param.name]) {
            queryParams.append(param.name, paramValues[param.name]);
          }
        });
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (endpoint.method !== 'GET' && endpoint.parameters) {
        const bodyData = endpoint.parameters.reduce((acc: any, param) => {
          if (paramValues[param.name]) {
            acc[param.name] = paramValues[param.name];
          }
          return acc;
        }, {});
        options.body = JSON.stringify(bodyData);
      }

      const response = await fetch(url, options);
      const data = await response.json();
      
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResponse(JSON.stringify({
        error: 'Failed to fetch',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleParamChange = (paramName: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleEndpointSelect = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setActiveSection('endpoints');
    setIsSidebarOpen(false);
    setParamValues({}); 
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    setSelectedEndpoint(null);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Head>
        <title>BotzAku API Documentation</title>
        <link rel="icon" href="https://kappa.lol/KGvGu" />
        <meta name="description" content="Welcome to the API botzaku.eu.org, a REST API designed to meet the needs of developers and users seeking comprehensive solutions for integrating applications. With its advanced and user-friendly features, this API offers various tools and downloaders that can help in developing more efficient and effective applications." />
        <meta name="keywords" content="BotzAku, Botza, Botzaa, RestApi, Api, Codingan, Bot, Bot Telegram, Bot WhatsApp, GitHub, Scrape, botzaku, bot botzaku" />
        <meta name="author" content="Riski Yanda" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 md:hidden"
              >
                {isSidebarOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
              </button>
              <div className="flex items-center">
                <IconApi className="text-blue-400 mr-2" size={24} />
                <span className="text-xl font-bold text-blue-400">BotzAku</span>
              </div>
            </div>

            <a href="https://github.com/BotzIky" className="nav-link flex items-center">
              <IconBrandGithub className="mr-1" size={20} />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <div className="pt-16 flex relative">
        <div className={`docs-sidebar custom-scrollbar ${!isSidebarOpen ? 'mobile-hidden' : ''}`}>
          <div className="p-4">
            <div className="mb-6">
              <button 
                onClick={() => toggleSection('gettingStarted')}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-400 uppercase mb-2"
              >
                <span>Getting Started</span>
                <IconChevronDown 
                  size={16} 
                  className={`transform transition-transform ${expandedSections.gettingStarted ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSections.gettingStarted && (
                <ul className="mt-2 space-y-2">
                  <li>
                    <button 
                      onClick={() => handleSectionClick('introduction')}
                      className={`sidebar-link ${activeSection === 'introduction' ? 'text-blue-400' : ''}`}
                    >
                      <IconChevronRight size={16} className="min-w-[16px] mr-2" />
                      <span>Introduction</span>
                    </button>
                  </li>
                  {/* 
                  <li>
                    <button 
                      onClick={() => handleSectionClick('authentication')}
                      className={`sidebar-link ${activeSection === 'authentication' ? 'text-blue-400' : ''}`}
                    >
                      <IconChevronRight size={16} className="min-w-[16px] mr-2" />
                      <span>Authentication</span>
                    </button>
                  </li>
                  */}
                </ul>
              )}
            </div>
            
            <div>
              <button 
                onClick={() => toggleSection('endpoints')}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-400 uppercase mb-2"
              >
                <span>Endpoints</span>
                <IconChevronDown 
                  size={16} 
                  className={`transform transition-transform ${expandedSections.endpoints ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSections.endpoints && (
                <ul className="mt-2 space-y-2">
                  {endpoints.map((endpoint, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleEndpointSelect(endpoint)}
                        className={`sidebar-link ${selectedEndpoint?.path === endpoint.path ? 'text-blue-400' : ''}`}
                      >
                        <IconChevronRight size={16} className="min-w-[16px] mr-2" />
                        <span>{endpoint.path}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="docs-content w-full">
          {activeSection === 'introduction' && (
            <section className="mb-12" data-aos="fade-up">
              <h1 className="text-4xl font-bold text-blue-400 mb-6">BotzAku API Documentation</h1>
              <p className="text-gray-300 mb-4">
                Welcome to the BotzAku API documentation. This API provides access to various features
                and functionalities of the BotzAku platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-gray-800/30 rounded-xl">
                  <IconBook className="text-blue-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Getting Started</h3>
                  <p className="text-gray-300">
                    Learn how to integrate BotzAku API into your applications.
                  </p>
                </div>
                <div className="p-6 bg-gray-800/30 rounded-xl">
                  <IconCode className="text-blue-400 mb-4" size={32} />
                  <h3 className="text-xl font-bold text-blue-400 mb-2">API Reference</h3>
                  <p className="text-gray-300">
                    Explore our comprehensive API endpoint documentation.
                  </p>
                </div>
              </div>
            </section>
          )} 
          {/*
          {activeSection === 'authentication' && (
            <section className="mb-12" data-aos="fade-up">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Authentication</h2>
              <div className="api-section">
                <p className="text-gray-300 mb-4">
                  All API requests require authentication using an API key. Include your API key
                  in the request headers:
                </p>
                <div className="code-block">
                  <SyntaxHighlighter language="json" style={atomOneDark}>
                    {`{
  "Authorization": "Bearer YOUR_API_KEY"
}`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </section>
          )}
          */}
          {activeSection === 'endpoints' && (
            <section data-aos="fade-up">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">API Endpoints</h2>
              {selectedEndpoint ? (
                <div className="api-section">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`method-badge method-${selectedEndpoint.method.toLowerCase()}`}>
                      {selectedEndpoint.method}
                    </span>
                    <span className="font-mono">{selectedEndpoint.path}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{selectedEndpoint.description}</p>
                  
                  {selectedEndpoint.parameters && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">Parameters</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-fixed">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="py-2 px-4 text-left text-gray-400 w-1/4">Name</th>
                              <th className="py-2 px-4 text-left text-gray-400 w-1/4">Type</th>
                              <th className="py-2 px-4 text-left text-gray-400 w-1/4">Required</th>
                              <th className="py-2 px-4 text-left text-gray-400 w-1/4">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedEndpoint.parameters.map((param, index) => (
                              <tr key={index} className="border-b border-gray-800">
                                <td className="py-2 px-4 text-gray-300">{param.name}</td>
                                <td className="py-2 px-4 text-gray-300">{param.type}</td>
                                <td className="py-2 px-4 text-gray-300">{param.required ? 'Yes' : 'No'}</td>
                                <td className="py-2 px-4 text-gray-300">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Example Response</h3>
                    <div className="code-block">
                      <SyntaxHighlighter language="json" style={atomOneDark}>
                        {JSON.stringify(selectedEndpoint.response, null, 2)}
                      </SyntaxHighlighter>
                    </div>
                  </div>

                  <div className="test-panel">
                    <h3 className="text-lg font-semibold text-blue-400 mb-4">Test Endpoint</h3>
                    {selectedEndpoint.parameters && (
                      <div className="space-y-4 mb-4">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <div key={index}>
                            <label className="block text-gray-300 mb-2">
                              {param.name}
                              {param.required && <span className="text-red-400 ml-1">*</span>}
                            </label>
                            <input
                              type={param.type === 'password' ? 'password' : 'text'}
                              placeholder={`Enter ${param.name}`}
                              className="input-field"
                              value={paramValues[param.name] || ''}
                              onChange={(e) => handleParamChange(param.name, e.target.value)}
                              required={param.required}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleTest(selectedEndpoint)}
                      className={`btn-primary flex items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <IconLoader2 size={20} className="mr-2 animate-spin" />
                      ) : (
                        <IconSend size={20} className="mr-2" />
                      )}
                      {isLoading ? 'Sending...' : 'Send Request'}
                    </button>
                    {testResponse && (
                      <div className="response-panel mt-4">
                        <h3 className="text-lg font-semibold text-blue-400 mb-2">Response</h3>
                        <SyntaxHighlighter language="json" style={atomOneDark}>
                          {testResponse}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {endpoints.map((endpoint, index) => (
                    <div
                      key={index}
                      className="endpoint-card"
                      onClick={() => handleEndpointSelect(endpoint)}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`method-badge method-${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <span className="font-mono">{endpoint.path}</span>
                      </div>
                      <p className="text-gray-400">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}