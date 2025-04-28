// app/pages/login.tsx

export default function Login() {
    return (
      <section className="p-8">
        <h1 className="text-3xl font-bold">Login</h1>
        <p>Login to your account.</p>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 w-full rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 w-full rounded"
          />
          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
            Login
          </button>
        </form>
      </section>
    );
  }
  