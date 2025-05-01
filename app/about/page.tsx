'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-100 to-blue-100 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">About Nirdeshona</h1>
        <p className="text-lg max-w-2xl mx-auto">
          We are dedicated to empowering learners and educators through innovative digital tools and a passion for lifelong learning.
        </p>
      </section>

      {/* Mission and Vision */}
      <section className="max-w-5xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            At Nirdeshona, our mission is to provide accessible, inclusive, and impactful education for all. We develop technologies that help students grow, explore, and succeed.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p>
            We envision a world where every learner has equal access to high-quality resources and guidance—anytime, anywhere—regardless of background or location.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Zahidul Haque Shuvo',
                role: 'Founder & Developer',
                image: '/team1.jpg',
              },
              {
                name: 'Marufa Begum',
                role: 'Creative Director',
                image: '/team2.jpg',
              },
              {
                name: 'Romana Haque (Maria)',
                role: 'Junior Designer',
                image: '/team3.jpg',
              },
            ].map((member, index) => (
              <div
                key={index}
                className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 px-4 bg-violet-100">
        <h2 className="text-2xl font-bold mb-4">Want to Work With Us?</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Whether you're a student, teacher, or partner organization, we'd love to hear from you and explore how we can grow together.
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
