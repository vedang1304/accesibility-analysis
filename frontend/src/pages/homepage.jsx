import { NavLink } from 'react-router';

function HomePage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      {/* Sticky Navbar */}
      <nav className="navbar bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          <NavLink to="/" className="text-2xl font-bold text-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            BrightWay
          </NavLink>
          <div className="space-x-4">
            <NavLink to="/scans" className="btn btn-ghost text-base">Scans</NavLink>
            <NavLink to="/login" className="btn btn-ghost text-base">Log in</NavLink>
            <NavLink to="/signup" className="btn btn-primary text-base">Get started</NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            The most comprehensive <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Web Accessibility Scanning Platform
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            BrightWay scans your website for accessibility issues and provides
            detailed, actionable reports to help you achieve WCAG compliance with AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/scan">
              <button className="btn btn-primary btn-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Scan your site for free
              </button>
            </NavLink>
            <NavLink to="/reports">
              <button className="btn btn-outline btn-lg">
                View Reports
              </button>
            </NavLink>
          </div>
        </div>
        

      </section>

      {/* Feature Section */}
      <section className="px-6 py-16 bg-base-100 text-left">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm mb-2 inline-block px-3 py-1 bg-blue-50 rounded-full">Comprehensive audits</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Identify accessibility barriers with precision</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Our automated scanners analyze your website to detect WCAG 2.1 violations, color contrast issues,
              missing alt text, and more. Highlight problems directly on your site and get code-level solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Our AI engine goes beyond basic scanning to understand context and provide intelligent recommendations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Automated Fix Suggestions</h3>
              <p className="text-gray-600">
                Get specific code-level solutions for every accessibility issue identified.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Compliance Tracking</h3>
              <p className="text-gray-600">
                Monitor your progress towards WCAG 2.1 Level AA compliance with detailed reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Visualization Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-semibold text-sm mb-2 inline-block px-3 py-1 bg-purple-100 rounded-full">How it works</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Streamlined Accessibility Workflow</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Our AI-powered process simplifies accessibility compliance with a clear, actionable workflow
            </p>
          </div>
          
          <div className="workflow-steps relative py-10">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 hidden md:block"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-16 md:mb-24">
              <div className="w-full md:w-1/2 md:pr-16 mb-6 md:mb-0 text-right md:text-right">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                  <div className="text-blue-600 font-bold text-sm mb-2">STEP 1</div>
                  <h3 className="text-xl font-bold mb-3">Website Scanning</h3>
                  <p className="text-gray-600">
                    Our AI crawler scans your entire website to identify accessibility issues across all pages.
                  </p>
                </div>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full  items-center justify-center text-white font-bold z-10 hidden md:flex">
                1
              </div>
              
             
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center mb-16 md:mb-24">
              <div className="w-full md:w-1/2 md:pr-16 order-2 md:order-1">
                
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full  items-center justify-center text-white font-bold z-10 hidden md:flex">
                2
              </div>
              
              <div className="w-full md:w-1/2 md:pl-16 mb-6 md:mb-0 text-left order-1 md:order-2">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                  <div className="text-blue-600 font-bold text-sm mb-2">STEP 2</div>
                  <h3 className="text-xl font-bold mb-3">AI-Powered Analysis</h3>
                  <p className="text-gray-600">
                    Our artificial intelligence categorizes issues by severity and provides contextual insights.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center mb-16 md:mb-24">
              <div className="w-full md:w-1/2 md:pr-16 mb-6 md:mb-0 text-right">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                  <div className="text-blue-600 font-bold text-sm mb-2">STEP 3</div>
                  <h3 className="text-xl font-bold mb-3">Actionable Reports</h3>
                  <p className="text-gray-600">
                    Receive detailed reports with prioritized issues and step-by-step remediation guides.
                  </p>
                </div>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full  items-center justify-center text-white font-bold z-10 hidden md:flex">
                3
              </div>
              
             
            </div>
            
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 md:pr-16 order-2 md:order-1">
               
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full  items-center justify-center text-white font-bold z-10 hidden md:flex">
                4
              </div>
              
              <div className="w-full md:w-1/2 md:pl-16 mb-6 md:mb-0 text-left order-1 md:order-2">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                  <div className="text-blue-600 font-bold text-sm mb-2">STEP 4</div>
                  <h3 className="text-xl font-bold mb-3">Continuous Compliance</h3>
                  <p className="text-gray-600">
                    Monitor your accessibility compliance over time with automated scans and progress tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Start your accessibility journey today</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of developers creating more inclusive web experiences with AI-powered insights</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/signup">
              <button className="btn btn-primary text-white">
                Get Started Free
              </button>
            </NavLink>
            <NavLink to="/demo">
              <button className="btn btn-outline btn-lg text-white">
                Try AI-Assit
              </button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">BrightWay</h3>
              <p className="mb-4">Making the web accessible for everyone through AI-powered technology</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">Roadmap</a></li>
                <li><a href="#" className="hover:text-white">Accessibility Scanner</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Accessibility Guide</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Webinars</a></li>
                <li><a href="#" className="hover:text-white">WCAG Checklist</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Legal</a></li>
                <li><a href="#" className="hover:text-white">Accessibility Statement</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} BrightWay Accessibility Inc. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Made with accessibility in mind</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;