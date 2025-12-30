import React, { useState } from 'react';
import { api } from '../services/api';

const Contact: React.FC = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.sendMessage(data);
      setStatus('Message sent successfully!');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus(`Error: ${err.message || 'Failed to send'}`);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 reveal">
        <div>
          <p className="font-mono text-accent text-sm mb-2 tracking-wider uppercase">Contact</p>
          <h2 className="text-4xl font-bold text-site-text mb-6 font-mono">Let’s Talk</h2>
          <p className="text-muted text-lg leading-relaxed mb-8 font-sans">
            Have a project in mind or want to discuss data analysis? I'd love to hear from you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-muted">
              <div className="w-10 h-10 rounded-full bg-transparent border border-border flex items-center justify-center text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <span className="font-mono">ganesh@example.com</span>
            </div>
            <div className="flex items-center gap-4 text-muted">
              <div className="w-10 h-10 rounded-full bg-transparent border border-border flex items-center justify-center text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <span className="font-mono">Chennai, India</span>
            </div>
          </div>
        </div>

        <div className="bg-transparent border border-border rounded-3xl p-8">
          <form id="contact-form" className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted uppercase tracking-wider font-mono">Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-site-text focus:outline-none focus:border-accent transition-colors font-mono"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted uppercase tracking-wider font-mono">Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-site-text focus:outline-none focus:border-accent transition-colors font-mono"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted uppercase tracking-wider font-mono">Message</label>
              <textarea 
                name="message" 
                rows={4} 
                required 
                className="w-full bg-transparent border border-border rounded-md px-4 py-3 text-site-text focus:outline-none focus:border-accent transition-colors resize-none font-mono"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-accent text-black font-bold py-4 rounded-md hover:opacity-90 transition-opacity font-mono uppercase tracking-wider"
            >
              Send Message
            </button>
            {status && (
              <p className={`text-center text-sm font-mono ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
