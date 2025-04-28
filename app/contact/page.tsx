export default function ContactPage() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="mt-2">
          We'd love to hear from you! Please feel free to reach out using the form below or via the contact information provided.
        </p>
  
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Contact Form</h2>
          <form className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>
  
            <div>
              <label htmlFor="email" className="block text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>
  
            <div>
              <label htmlFor="message" className="block text-lg">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full p-2 rounded border border-gray-300"
                required
              />
            </div>
  
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded"
            >
              Send Message
            </button>
          </form>
        </div>
  
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Other Contact Information</h2>
          <p className="mt-2">You can also reach us at:</p>
          <ul className="list-disc mt-4 ml-5">
            <li>Email: contact@mysite.com</li>
            <li>Phone: +1 (234) 567-8901</li>
            <li>Address: 123 Main St, City, Country</li>
          </ul>
        </div>
      </div>
    );
  }
  