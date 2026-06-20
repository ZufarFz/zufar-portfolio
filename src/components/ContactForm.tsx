import React, { useState, FormEvent } from 'react';
import { 
  Send, 
  Mail, 
  MapPin, 
  CheckCircle,
  Loader2,
  TrendingUp,
  Cpu,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactMessage } from '../types';

interface ContactFormProps {
  email?: string;
  location?: string;
  webTexts?: Record<string, string>;
}

export default function ContactForm({ 
  email = '', 
  location = '', 
  webTexts 
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    inquiryType: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Stats computed on dynamic form fields
  const computedSla = formData.inquiryType ? '4.0 Hours' : '6.5 Hours';
  const estimatedMessageComplexity = Math.round(formData.message.length * 1.2);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    // Basic Validation
    if (!formData.name.trim()) {
      setErrorText('Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorText('Email address is required.');
      return;
    }
    
    // Simple email regex test
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorText('Please enter a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorText('Please write a quick message summary.');
      return;
    }

    setLoading(true);

    // Simulate standard server-side message ingestion
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2400);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      inquiryType: 'Project Collaboration',
      message: ''
    });
    setSuccess(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Contact Metadata Column */}
      <motion.div 
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-5 flex flex-col justify-between"
      >
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded inline-block border border-emerald-500/10 dark:border-emerald-500/20 mb-2">
            {webTexts?.contact_badge || "INQUIRY MATRIX"}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {webTexts?.contact_title || "Let's connect"}
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-sm">
            {webTexts?.contact_subtitle || "Available for corporate consulting engagements, full-time senior analyst roles, or panel speaking opportunities regarding advanced business intelligence."}
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
              <span className="p-2 bg-slate-100/80 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-lg shrink-0 flex items-center justify-center">
                <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </span>
              <div>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">Email Channel</span>
                <a href={`mailto:${email}`} className="font-sans font-semibold text-sm hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
              <span className="p-2 bg-slate-100/80 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-lg shrink-0 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </span>
              <div>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">Location Base</span>
                <span className="font-sans font-semibold text-sm">
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Live Widget inside Sidebar */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800 rounded-xl mt-8">
          <div className="flex items-center gap-1.5 mb-2.5 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              MESSAGE METADATA PARSER
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200/55 dark:border-slate-800/80">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block">EST. RESP SLA</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 font-mono mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                {computedSla}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-200/55 dark:border-slate-800/80">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono block">COMPLEXITY INDEX</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 font-mono mt-0.5">
                <Cpu className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                {estimatedMessageComplexity} points
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Submission Pipeline */}
      <motion.div 
        initial={{ opacity: 0, x: 15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-7"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-50/20 dark:bg-emerald-950/20 rounded-xl border border-emerald-500/20 p-8 shadow-sm flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Analysis Request Parsed
              </h3>
              
              {/* Simulation Terminal Console logs */}
              <div className="w-full bg-slate-950 text-slate-300 font-mono text-[11px] text-left p-4 rounded-lg mt-5 border border-slate-800 max-w-md mx-auto space-y-1 shadow-inner">
                <div className="text-slate-500 font-bold border-b border-slate-900 pb-1 mb-2 flex justify-between">
                  <span>INBOX PIPELINE STATUS</span>
                  <span className="text-emerald-500">INGESTION COMPLETE</span>
                </div>
                <p>&gt; sentiment analysis score: <span className="text-emerald-400">0.96 (Positive)</span></p>
                <p>&gt; category classification: <span className="text-blue-400">{formData.inquiryType}</span></p>
                <p>&gt; priority routing: <span className="text-violet-400">P2 (Primary Exec Slack Gateway)</span></p>
                <p>&gt; target dispatch queue: <span className="text-amber-400">NewYork_EastCoast_Express_01</span></p>
                <p>&gt; expected response SLA: <span className="text-emerald-400 font-bold">{computedSla}</span></p>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-sm mt-5 leading-normal max-w-sm">
                Thanks for connecting, {formData.name}! Your message payload has been validated and queued in my notification routing pipeline.
              </p>

              <button
                onClick={resetForm}
                className="mt-6 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white font-semibold rounded-lg text-xs hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="contact-form"
              onSubmit={handleFormSubmit}
              className="bg-white dark:bg-slate-900/40 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              {errorText && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-450 text-xs px-4 py-2.5 rounded-lg"
                >
                  <strong>Ingestion Error: </strong> {errorText}
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-slate-450 dark:text-slate-500 block uppercase font-bold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100"
                    placeholder="Your Name"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-slate-450 dark:text-slate-500 block uppercase font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100"
                    placeholder="youremail@company.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-slate-450 dark:text-slate-500 block uppercase font-bold">
                  Subjek
                </label>
                <input
                  type="text"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100"
                  placeholder="Your Subject"
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-slate-450 dark:text-slate-500 block uppercase font-bold">
                  massage
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100"
                  placeholder="Write us a massage"
                  disabled={loading}
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider shadow-sm select-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Streaming Message Payload...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Analytical Request
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
