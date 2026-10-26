import React, { useState } from 'react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section className="py-12 bg-[#f4f4f2] border-b border-[#e2e3e1]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#1a1c1b] font-display">
              Join The Studio Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-[#5f5e5e] mt-1">
              Get early access to limited edition drops, secret discount codes, and custom blanks.
            </p>
          </div>

          {subscribed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono rounded-sm">
              ✓ Welcome to the atelier dispatch. Use code <span className="font-bold">FIRSTDROP</span> for 10% off.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center w-full lg:w-auto max-w-md gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="bg-white border border-[#e2e3e1] px-4 py-3 text-sm text-[#1a1c1b] rounded-sm focus:border-[#1a1c1b] focus:ring-0 outline-none w-full placeholder:text-[#c8c6c5]"
              />
              <button
                type="submit"
                className="bg-[#1a1c1b] hover:bg-black text-white px-6 py-3 text-sm font-semibold rounded-sm shrink-0 transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
