import React from 'react';
import { motion } from 'framer-motion';

export default function LocationSection() {
  return (
    <section className="py-28 bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl sm:text-5xl text-white mb-4">
            We're in <span className="italic">Santa Barbara</span>
          </h2>
          <p className="font-body text-white/80 text-lg">
            3942 La Colina Rd, Santa Barbara, CA 93110
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.4235623456!2d-119.75789!3d34.3942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e9d5c7b8c5b5b5%3A0x8c8c8c8c8c8c8c8c!2s3942%20La%20Colina%20Rd%2C%20Santa%20Barbara%2C%20CA%2093110!5e0!3m2!1sen!2sus!4v1234567890&t=m"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}