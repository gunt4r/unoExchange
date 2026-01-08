'use client';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePostContact } from '@/queries/useContact';

export function ClientContacts() {
  const t = useTranslations('Contacts');
  const tCommon = useTranslations('Common');
  const { mutate: postContact } = usePostContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    postContact(formData, {
      onSuccess: () => {
        toast.success(tCommon('thanks'));
        setSubmitted(false);
      },
      onError: () => {
        toast.error(tCommon('something_went_wrong'));
      },
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Złota 71', '00-819', 'Warszawa, Poland'],
      link: 'https://maps.google.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+48 692 080 561'],
      link: 'tel:+48692080561',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['zlotakantor@gmail.com'],
      link: 'mailto:zlotakantor@gmail.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 10:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 2:00 PM', 'Sunday: Closed'],
      link: null,
    },
  ];

  return (
    <section id="contact" className="relative py-20">
      <div className="absolute inset-0 ">
        <div className="absolute top-1/4 left-0 h-96 w-full rounded-full bg-green-500/10 blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-green-600/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
            <span className="text-sm text-green-400">{t('badge')}</span>
          </div>
          <h2 className="mb-4 text-4xl text-white">{t('title')}</h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            {t('description')}
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-6 transition-all hover:border-green-500/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-400 to-green-600">
                <info.icon className="h-6 w-6 text-black" />
              </div>
              <h3 className="mb-3 text-white">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, idx) => (
                  info.link && idx === 0
                    ? (
                        <a
                          key={idx}
                          href={info.link}
                          className="block text-sm text-gray-400 transition-colors hover:text-green-400"
                        >
                          {detail}
                        </a>
                      )
                    : (
                        <p key={idx} className="text-sm text-gray-400">{detail}</p>
                      )
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8">
            <h3 className="mb-6 text-2xl text-white">{t('send_message')}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 block text-sm text-gray-400">{t('your_name')}</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-green-500/20 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <p className="mb-2 block text-sm text-gray-400">{t('your_email')}</p>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-green-500/20 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 block text-sm text-gray-400">{t('your_phone')}</p>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-green-500/20 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                    placeholder="+48 (555) 000-000"
                  />
                </div>
                <div>
                  <p className="mb-2 block text-sm text-gray-400">{t('subject')}</p>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full cursor-pointer rounded-xl border border-green-500/20 bg-black/50 px-4 py-3 text-white transition-colors outline-none focus:border-green-500/40"
                  >
                    <option value="">{t('select_subject')}</option>
                    <option value="general">{t('general_inquiry')}</option>
                    <option value="support">{t('technical_support')}</option>
                    <option value="business">{t('business_enquiries')}</option>
                    <option value="feedback">{t('feedback')}</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="mb-2 block text-sm text-gray-400">{t('your_message')}</p>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full resize-none rounded-xl border border-green-500/20 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                  placeholder={t('tell_us_how_can_we_help')}
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-8 py-4 shadow-lg transition-all ${
                  submitted
                    ? 'bg-green-600 text-white'
                    : 'bg-linear-to-r from-green-600 to-green-500 text-white shadow-green-500/30 hover:from-green-500 hover:to-green-400'
                }`}
              >
                {submitted
                  ? (
                      <>
                        <span>{t('message_sent')}</span>
                      </>
                    )
                  : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>{t('send_message_2')}</span>
                      </>
                    )}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="h-full overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black">
              <iframe
                sandbox="allow-scripts"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.7609255595335!2d20.997088700000003!3d52.2295612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc8e195407b9%3A0xeab277fc5e54914d!2zWsWCb3RhIDcxLCAwMC04MTkgV2Fyc3phd2EsINCf0L7Qu9GM0YjQsA!5e0!3m2!1sru!2s!4v1767897955167!5m2!1sru!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
