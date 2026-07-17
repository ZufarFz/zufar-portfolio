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
  lang?: 'id' | 'en';
  theme?: 'light' | 'dark';
}

export default function ContactForm({ 
  email = '', 
  location = '', 
  webTexts,
  lang = 'en',
  theme = 'light'
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

    // Basic Validation
    if (!formData.name.trim()) {
      setErrorText(lang === 'id' ? 'Nama wajib diisi.' : 'Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorText(lang === 'id' ? 'Alamat email wajib diisi.' : 'Email address is required.');
      return;
    }
    
    // Simple email regex test
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
    
    // Construct the mailto link to open the user's default email client with pre-filled content
    const subjectLine = encodeURIComponent(formData.inquiryType.trim() ? formData.inquiryType : (lang === 'id' ? 'Kontak dari Portofolio' : 'Inquiry from Portfolio'));
    const bodyText = encodeURIComponent(
      `${lang === 'id' ? 'Nama' : 'Name'}: ${formData.name}\n` +
      `${lang === 'id' ? 'Email Pengirim' : 'Sender Email'}: ${formData.email}\n\n` +
      `${lang === 'id' ? 'Pesan' : 'Message'}:\n${formData.message}`
    );
    
    const mailtoUrl = `mailto:${email}?subject=${subjectLine}&body=${bodyText}`;

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Trigger opening the mail client
      window.location.href = mailtoUrl;
    }, 1200);
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
      {/* Contact Metadata Column */}
      <motion.div 
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-5 flex flex-col justify-between"
      >
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {webTexts?.contact_title || (lang === 'id' ? "Mari terhubung" : "Let's connect")}
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-sm text-justify">
            {webTexts?.contact_subtitle || (lang === 'id' ? "Tersedia untuk konsultasi perusahaan, peran analis senior penuh waktu, atau pembicara panel tentang kecerdasan bisnis tingkat lanjut." : "Available for corporate consulting engagements, full-time senior analyst roles, or panel speaking opportunities regarding advanced business intelligence.")}
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
              <span className="p-2 bg-slate-100/80 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-lg shrink-0 flex items-center justify-center">
                <Mail className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </span>
              <div>
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">
                  {lang === 'id' ? "Saluran Email" : "Email Channel"}
                </span>
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
                <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block uppercase font-bold">
                  {lang === 'id' ? "Lokasi Basis" : "Location Base"}
                </span>
                <span className="font-sans font-semibold text-sm">
                  {location}
                </span>
              </div>
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
                <strong>{lang === 'id' ? "Kesalahan Validasi" : "Ingestion Error"}: </strong> {errorText}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  theme === 'dark'
                    ? 'bg-emerald-950/25 border-emerald-500/20 text-emerald-300'
                    : 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'id' 
                      ? "Pesan disiapkan! Aplikasi email Anda seharusnya otomatis terbuka." 
                      : "Email prepared! Your email application should open automatically."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const subjectLine = encodeURIComponent(formData.inquiryType.trim() ? formData.inquiryType : (lang === 'id' ? 'Kontak dari Portofolio' : 'Inquiry from Portfolio'));
                    const bodyText = encodeURIComponent(
                      `${lang === 'id' ? 'Nama' : 'Name'}: ${formData.name}\n` +
                      `${lang === 'id' ? 'Email Pengirim' : 'Sender Email'}: ${formData.email}\n\n` +
                      `${lang === 'id' ? 'Pesan' : 'Message'}:\n${formData.message}`
                    );
                    window.location.href = `mailto:${email}?subject=${subjectLine}&body=${bodyText}`;
                  }}
                  className="underline font-bold hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors cursor-pointer text-[10px] uppercase tracking-wider shrink-0"
                >
                  {lang === 'id' ? "Buka Email Lagi" : "Reopen Email"}
                </button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                  {lang === 'id' ? "Nama Lengkap" : "Full Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100"
                  placeholder={lang === 'id' ? "Nama Anda" : "Your Name"}
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                  {lang === 'id' ? "Alamat Email" : "Email Address"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100"
                  placeholder={lang === 'id' ? "emailAnda@perusahaan.com" : "youremail@company.com"}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                {lang === 'id' ? "Subjek" : "Subject"}
              </label>
              <input
                type="text"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100"
                placeholder={lang === 'id' ? "Subjek Pesan" : "Your Subject"}
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                {lang === 'id' ? "Pesan" : "Message"}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100"
                placeholder={lang === 'id' ? "Tulis pesan Anda di sini..." : "Write us a message"}
                disabled={loading}
              ></textarea>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider shadow-md select-none ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 shadow-slate-950/30'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {lang === 'id' ? "Mengirim Email..." : "Sending Email..."}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {lang === 'id' ? "Kirim Email" : "Send Email"}
                </>
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
