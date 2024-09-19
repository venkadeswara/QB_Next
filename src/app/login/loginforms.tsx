"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<string | null>(null);
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiBaseAuthentication = process.env.NEXT_PUBLIC_API_BASE_AUTHENTICATION;

  useEffect(() => {
    const fetchLoginData = async () => {
      try {
        const response = await fetch(`${apiBaseAuthentication}login`, {
          method: "GET",
          credentials: "include",
        });
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const token = doc
          .querySelector('meta[name="_csrf"]')
          ?.getAttribute("content");
        setCsrfToken(token || null);
        const loginMethodInput = doc
          .querySelector('input[name="with"]')
          ?.getAttribute("value");
        setLoginMethod(loginMethodInput || null);
        const ssoLink = doc.querySelector("a[href]");
        if (ssoLink) {
          setRemoteUrl(ssoLink.getAttribute("href") || null);
        }
      } catch (error) {
        console.error("Error fetching login data:", error);
      }
    };

    fetchLoginData();
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    if (loginMethod === "SSO_URL" && remoteUrl) {
      window.location.href = remoteUrl;
      return;
    }

    const data = {
      _csrf: csrfToken,
      with: loginMethod,
      username: username,
      password: password,
      loginMethodId: loginMethod,
    };

    try {
      const response = await fetch(`${apiBaseAuthentication}login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data as any).toString(),
      });

      if (response.url !== `${apiBaseAuthentication}/login`) {
        console.log("Sign in successful, redirecting...");
        router.push("/queries");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("There was a problem with the sign-in operation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-lg mx-auto mt-32 p-4 border border-gray-300 rounded-lg"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-blue-500 text-white rounded-md border-none flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 mr-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        ) : null}
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
