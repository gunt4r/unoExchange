'use client';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePostContact } from '@/queries/useContact';

export function ClientContacts() {
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
        toast.success('Thanks for contacting us!');
        setSubmitted(false);
      },
      onError: () => {
        toast.error('Something went wrong, please try again.');
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
      details: ['123 Exchange Street', 'Financial District', 'New York, NY 10004', 'United States'],
      link: 'https://maps.google.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      link: 'tel:+15551234567',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@exchangepro.com', 'business@exchangepro.com'],
      link: 'mailto:support@exchangepro.com',
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
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute top-1/4 left-0 h-96 w-full rounded-full bg-green-500/10 blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-green-600/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
            <span className="text-sm text-green-400">Get In Touch</span>
          </div>
          <h2 className="mb-4 text-4xl text-white">Contact Us</h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            Have questions? We're here to help. Reach out to us through any of the channels below.
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

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black p-8">
            <h3 className="mb-6 text-2xl text-white">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 block text-sm text-gray-400">Your Name</p>
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
                  <p className="mb-2 block text-sm text-gray-400">Email Address</p>
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
                  <p className="mb-2 block text-sm text-gray-400">Phone Number</p>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-green-500/20 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <p className="mb-2 block text-sm text-gray-400">Subject</p>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full cursor-pointer rounded-xl border border-green-500/20 bg-black/50 px-4 py-3 text-white transition-colors outline-none focus:border-green-500/40"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="business">Business Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="mb-2 block text-sm text-gray-400">Message</p>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full resize-none rounded-xl border border-green-500/20 bg-black/50 px-4 py-3 text-white placeholder-gray-500 transition-colors outline-none focus:border-green-500/40"
                  placeholder="Tell us how we can help you..."
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
                        <span>Message Sent!</span>
                      </>
                    )
                  : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {/* Map */}
            <div className="h-full overflow-hidden rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-900 to-black">
              <iframe
                sandbox="allow-scripts"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.7609255595335!2d20.997088700000003!3d52.2295612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc8e195407b9%3A0xeab277fc5e54914d!2zWsWCb3RhIDcxLCAwMC04MTkgV2Fyc3phd2EsINCf0L7Qu9GM0YjQsA!5e0!3m2!1sru!2s!4v1766524682988!5m2!1sru!2s"
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
