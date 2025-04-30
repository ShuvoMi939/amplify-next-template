// app/components/Footer.tsx

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* About */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">About Nirdeshona</h3>
          <p className="text-sm leading-relaxed">
            Nirdeshona is a student-first initiative focused on accessible education, 
            empowering learners across Bangladesh through innovative tools and community support.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
            <li><a href="/dashboard/feed" className="hover:text-white transition">Feed</a></li>
            <li><a href="/dashboard/courses" className="hover:text-white transition">Courses</a></li>
            <li><a href="/dashboard/posts" className="hover:text-white transition">Posts</a></li>
            <li><a href="/dashboard/support" className="hover:text-white transition">Support</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/terms" className="hover:text-white transition">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
            <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
          </ul>
        </div>

        {/* Contact / Newsletter */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="text-sm space-y-2">
            <li>Email: <a href="mailto:ins.org.24@gmail.com" className="hover:text-white">ins.org.24@gmail.com</a></li>
            <li>Phone: <a href="tel:+880123456789" className="hover:text-white">+880 123 456 789</a></li>
            <li>Dhaka, Bangladesh</li>
          </ul>

          <form className="mt-6 hidden sm:block">
            <label className="block mb-2 text-sm">Subscribe to our newsletter</label>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 text-sm text-black rounded-l-md focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 px-4 text-white text-sm font-medium rounded-r-md hover:bg-blue-700"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Nirdeshona. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
