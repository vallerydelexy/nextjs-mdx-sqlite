"use client";
import { useState, useEffect } from "react";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function WhatsAppButton({
  phoneNumber = "6281276763536",
  message = "Hello! I'd like to chat with you.",
  position = "bottom-right",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    const pulseTimer = setTimeout(() => setIsPulsing(false), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.5) rotate(-15deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .wa-btn-animate { animation: fadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .wa-float { animation: float 3s ease-in-out infinite; }
        .wa-ripple::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: #25D366;
          animation: ripple 2s ease-out infinite;
        }
        .wa-bubble { animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .wa-dot { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Chat bubble popup */}
        {isOpen && (
          <div className="wa-bubble rounded-2xl shadow-2xl md:w-[32rem] overflow-hidden">
            {/* Header */}
            <div className="bg-[#075E54] p-4 flex items-center gap-3">
              <div className="relative">
                <img
                  src="/images/rizki-aprita-bw.jpg"
                  alt="Rizki Aprita"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075E54] rounded-full" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Rizki Aprita</p>
                <p className="text-green-300 text-xs flex items-center gap-1">
                  Online
                </p>
              </div>
            </div>

            {/* Message area — now uses chat background from old component */}
            <div
              className="p-4 bg-[#EFE7DD] gap-3 flex flex-col items-start"
              style={{
                backgroundImage: "url('/images/whatsapp-bg.png')",
                backgroundRepeat: "repeat",
                backgroundSize: "auto",
              }}
            >
              <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-[85%] relative">
                <p className="text-[#075E54] font-semibold text-xs mb-1">
                  Rizki Aprita
                </p>
                <p className="text-gray-800 text-sm leading-relaxed">
                  jadi mau bikin apa nih?
                </p>
                <p className="text-gray-400 text-[10px] text-right mt-1">
                  Just now ✓✓
                </p>
                <div
                  className="absolute -left-2 top-0 w-0 h-0"
                  style={{
                    borderRight: "8px solid white",
                    borderBottom: "8px solid transparent",
                  }}
                />
              </div>
            </div>

            {/* CTA */}
            <div className="p-4 bg-white border-t border-gray-100">
              <button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20b858] active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Start Chat
              </button>
            </div>
          </div>
        )}

        {/* Main FAB */}
        {isVisible && (
          <div className="relative wa-btn-animate">
            {isPulsing && !isOpen && (
              <div className="absolute inset-0 rounded-full wa-ripple pointer-events-none" />
            )}

            <button
              onClick={() => {
                setIsOpen((o) => !o);
                setIsPulsing(false);
              }}
              className={`
                relative w-12 h-12 rounded-full shadow-lg
                flex items-center justify-center
                transition-all duration-300 ease-in-out
                active:scale-90
                ${
                  isOpen
                    ? "bg-gray-700 hover:bg-gray-800 rotate-0"
                    : "bg-[#25D366] hover:bg-[#20b858] wa-float hover:[animation-play-state:paused]"
                }
                text-white
              `}
              style={{
                boxShadow: isOpen
                  ? "0 8px 30px rgba(0,0,0,0.25)"
                  : "0 8px 30px rgba(37,211,102,0.5)",
              }}
              aria-label={isOpen ? "Close chat" : "Open WhatsApp chat"}
            >
              <span
                className="transition-all duration-300"
                style={{
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  display: "flex",
                }}
              >
                {isOpen ? <CloseIcon /> : <WhatsAppIcon />}
              </span>
            </button>

            {/* Notification dot */}
            {!isOpen && (
              <span className="wa-dot absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                1
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
