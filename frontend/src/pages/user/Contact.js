import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with us!</p>
        </div>
      </section>

      <div className="contact-container">
        {/* Contact Form and Info */}
        <section className="contact-main">
          <div className="contact-content">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <p>Have a question or need assistance? Fill out the form below and we'll respond as soon as possible.</p>

              {submitMessage && (
                <div className="success-message">
                  {submitMessage}
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <h2>Get in Touch</h2>
              <p>Reach out to us through any of the following channels:</p>

              <div className="contact-info-grid">
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-details">
                    <h4>Address</h4>
                    <p>123 Shopping Street<br />Commerce City, CC 12345<br />United States</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div className="contact-details">
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <p>support@e-shop.com<br />info@e-shop.com</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <FaClock />
                  </div>
                  <div className="contact-details">
                    <h4>Business Hours</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-media-section">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href="#" aria-label="Facebook" className="social-link">
                    <FaFacebook />
                  </a>
                  <a href="#" aria-label="Twitter" className="social-link">
                    <FaTwitter />
                  </a>
                  <a href="#" aria-label="Instagram" className="social-link">
                    <FaInstagram />
                  </a>
                  <a href="#" aria-label="LinkedIn" className="social-link">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How can I track my order?</h4>
              <p>You can track your order by logging into your account and visiting the "My Orders" section, or by using the tracking number sent to your email.</p>
            </div>
            <div className="faq-item">
              <h4>What is your return policy?</h4>
              <p>We offer a 30-day return policy for most items. Products must be in original condition with tags attached.</p>
            </div>
            <div className="faq-item">
              <h4>Do you offer international shipping?</h4>
              <p>Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.</p>
            </div>
            <div className="faq-item">
              <h4>How can I change or cancel my order?</h4>
              <p>Orders can be modified or cancelled within 1 hour of placement. Please contact us immediately for assistance.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}