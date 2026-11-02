import React, { useState, FormEvent } from 'react';
import { 
  Send, 
  CheckCircle,
  Loader2,
  TrendingUp,
  Cpu,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactMessage } from '../../types';
import { ContactInfoSidebar } from './ContactInfoSidebar';

export interface ContactFormProps {
  email?: string;
  location?: string;
  webTexts?: Record<string, string>;
  lang?: 'id' | 'en';
  theme?: 'light' | 'dark';
}

export const ContactForm: React.FC<ContactFormProps> = ({ 
  email = '', 
  location = '', 
  webTexts,
  lang = 'en',
  theme = 'light'
}) => {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    inquiryType: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const computedSla = formData.inquiryType 
    ? (lang === 'id' ? '4.0 Jam' : '4.0 Hours') 
    : (lang === 'id' ? '6.5 Jam' : '6.5 Hours');
  const estimatedMessageComplexity = Math.round(formData.message.length * 1.2);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (success) setSuccess(false);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    if (!formData.name.trim()) {
      setErrorText(lang === 'id' ? 'Nama wajib diisi.' : 'Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorText(lang === 'id' ? 'Alamat email wajib diisi.' : 'Email address is required.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorText(lang === 'id' ? 'Silakan masukkan alamat email yang valid.' : 'Please enter a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorText(lang === 'id' ? 'Silakan tulis pesan singkat Anda.' : 'Please write a quick message summary.');
      return;
    }

    setLoading(true);
    
    const targetEmail = email && email.trim() ? email.trim() : '';
    const subjectLine = formData.inquiryType.trim() 
      ? formData.inquiryType.trim() 
      : (formData.name.trim() 
          ? (lang === 'id' ? `Pesan Portofolio dari ${formData.name.trim()}` : `Portfolio Inquiry from ${formData.name.trim()}`)
          : (lang === 'id' ? 'Pesan Portofolio' : 'Portfolio Inquiry'));
    
    const bodyText = formData.message.trim();
    const encodedSubject = encodeURIComponent(subjectLine);
    const encodedBody = encodeURIComponent(bodyText);
    const encodedEmail = encodeURIComponent(targetEmail);
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}&body=${encodedBody}`;

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      const win = window.open(gmailUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = gmailUrl;
      }
    }, 500);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      inquiryType: '',
      message: ''
    });
    setSuccess(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <ContactInfoSidebar 
        email={email}
        location={location}
        webTexts={webTexts}
        lang={lang}
        theme={theme}
      />

      {/* Form Submission Pipeline */}
      <motion.div 
        initial={{ opacity: 0, x: 35 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.25, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-4"
            >
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'id' ? 'Gmail Siap Dikirim!' : 'Gmail Ready to Send!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {lang === 'id' 
                  ? 'Jendela komposer Gmail telah dibuka dengan rincian pesan Anda yang sudah terisi otomatis.' 
                  : 'Gmail composer window opened with your inquiry pre-filled.'}
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              >
                {lang === 'id' ? 'Kirim Pesan Lain' : 'Send Another Message'}
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="contact-form"
              onSubmit={handleFormSubmit}
              className="space-y-4"
            >
              {errorText && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                  {errorText}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
                    {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
                    {lang === 'id' ? 'Alamat Email' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
                  {lang === 'id' ? 'Topik / Jenis Diskusi' : 'Inquiry Category'}
                </label>
                <input
                  type="text"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  placeholder={lang === 'id' ? 'Kolaborasi Data Analytics / Proyek Baru' : 'Data Analytics Collaboration / New Role'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
                  {lang === 'id' ? 'Ringkasan Pesan' : 'Message Summary'}
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={lang === 'id' ? 'Tuliskan konteks proyek, pertanyaan, atau peluang kerjasama...' : 'Describe your project context, query, or strategic opportunity...'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:border-emerald-500/60 resize-none"
                />
              </div>

              {/* Dynamic SLA indicator */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>SLA Respons: {computedSla}</span>
                </span>
                <span>Panjang: {estimatedMessageComplexity} char index</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mempersiapkan Gmail...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{lang === 'id' ? 'Kirim via Gmail' : 'Send via Gmail'}</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactForm;

