// app/components/Footer.tsx

const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-screen-xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()}, Nirdeshona. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  