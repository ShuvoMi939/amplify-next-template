'use client';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Header section */}
      <section className="bg-gradient-to-r from-blue-100 to-violet-100 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Nirdeshona offers a comprehensive suite of services designed to empower individuals, startups, and organizations.
        </p>
      </section>

      {/* Services list */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Service Item */}
          <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🌐 Web Development</h3>
            <p className="text-gray-700">
              We build scalable, SEO-friendly websites and custom platforms using modern technologies like Next.js, Tailwind CSS, and more.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">📱 Mobile App Development</h3>
            <p className="text-gray-700">
              Our team creates fast, beautiful, and user-friendly mobile apps for both Android and iOS using Flutter and React Native.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">📈 Digital Marketing</h3>
            <p className="text-gray-700">
              From social media to SEO, we help boost your digital presence and connect you with the right audience.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">🎨 Graphic Design</h3>
            <p className="text-gray-700">
              We create stunning visuals, brand identities, and UI/UX designs to make your brand stand out.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow hover:shadow-md transition md:col-span-2">
            <h3 className="text-xl font-semibold mb-2">🤝 Consulting & Strategy</h3>
            <p className="text-gray-700">
              We offer personalized business, tech, and educational consulting to help you scale effectively and sustainably.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 px-4 bg-violet-100">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Let's collaborate to bring your ideas to life. Contact us today and take the first step toward success.
        </p>
        <Link href="/contact">
          <span className="inline-block px-6 py-3 bg-white text-black border border-gray-300 rounded shadow-sm hover:shadow-lg hover:border-gray-400 focus:ring-4 focus:ring-violet-300 transition duration-300">
            Contact Us
          </span>
        </Link>
      </section>
    </div>
  );
}
