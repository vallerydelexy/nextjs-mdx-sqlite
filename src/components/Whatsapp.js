"use client";
import { MoreVerticalIcon, LockIcon, SendHorizonalIcon } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function DraggableWhatsapp() {
  if (typeof window === "undefined") return;
  const todayDate = new Date();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessage] = useState([]);
  const inputEl = useRef(null);
  
  // Add state for position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

  function addToInput() {
    if (inputValue) {
      setMessage([...messages, inputValue]);
      const url = "https://api.whatsapp.com/send/?phone=6281276763536&text=";
      openInNewTab(url + inputValue);
    } else {
      inputEl.current.reportValidity();
    }
    inputEl.current.value = "";
  }

  const handleDrag = (e) => {
    setIsDragging(true);
    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };
  
  const handleMove = (e) => {
    if (isDragging) {
      if (e.cancelable) {
        e.preventDefault();
      }
  
      // Handle both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
      setPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y
      });
    }
  };
  
  const handleEnd = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    const options = { passive: false }; // Allow preventDefault to be called
  
    if (isDragging) {
      // Add both mouse and touch event listeners
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, options);
      window.addEventListener('touchend', handleEnd);
    } else {
      // Remove both mouse and touch event listeners
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    }
  
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div 
      className="rounded-lg overflow-clip shadow-lg max-w-screen-md mx-auto"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="flex flex-col">
        {/* Header - Add mousedown handler here */}
        <div 
          className="bg-whatsapp-darkGreen flex flex-row items-center justify-between px-3 py-2 cursor-grab"
          onMouseDown={handleDrag}
          onTouchStart={handleDrag}
        >
          <Link href="tel:+6281276763536" className="flex items-center">
            <div>
              <img
                className="h-10 w-10 rounded-full"
                src="/images/rizki-aprita-bw.jpg"
              />
            </div>
            <div className="ml-4">
              <p className="text-white font-semibold">Rizki Aprita</p>
              <p className="text-white mt-1 text-xs">Online</p>
            </div>
          </Link>

          <div className="flex">
            <div className="ml-6">
              <MoreVerticalIcon className="text-white" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-auto max-h-[20em] bg-whatsapp-brown"
          style={{
            backgroundImage: `url('/images/whatsapp-bg.png')`,
          }}
        >
          <div className="px-3 py-2">
            <div className="mb-2 flex justify-center">
              <div className="rounded px-4 py-2 bg-whatsapp-lightBlue dark:bg-whatsapp-darkBlue">
                <p className="text-xs">
                  {todayDate.toLocaleDateString("id", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mb-4 flex justify-center">
              <div className="rounded px-4 py-2 flex items-center gap-2 bg-whatsapp-cream dark:bg-whatsapp-darkCream">
                <LockIcon className="w-3 h-3" />
                <p className="text-xs">
                  Messages are now secured with end-to-end encryption.
                </p>
              </div>
            </div>

            <div className="mb-2 flex">
              <div className="rounded px-3 py-2 bg-gray-100 dark:bg-gray-800">
                <p className="text-whatsapp-darkGreen dark:text-whatsapp-brightGreen font-semibold text-sm">
                  Rizki Aprita
                </p>
                <p className="mt-1 text-sm">
                  Hai saya Rizki, <br></br> Saya membuat website dan apilkasi
                  yang mudah dipahami dan digunakan
                </p>
                <p className="text-gray-500 mt-1 text-right text-xs">
                  {todayDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h23",
                  })}
                </p>
              </div>
            </div>

            {messages.map((msg, i) => (
              <div key={i} className="mb-2 flex justify-end">
                <div className="rounded px-3 py-2 bg-gray-100 dark:bg-slate-800">
                  <p className="mt-1 text-sm">{msg}</p>
                  <p className="text-gray-500 mt-1 text-right text-xs">
                    {todayDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-gray-50 dark:bg-gray-800 flex items-center pr-4 py-4">
          <div className="mx-4 flex-1">
            <input
              className="w-full rounded-lg border px-2 py-2 focus:outline-0 dark:text-gray-50 text-gray-950 dark:bg-gray-900 bg-gray-50"
              type="text"
              onChange={(e) => setInputValue(e.target.value)}
              required
              ref={inputEl}
            />
          </div>
          <button
            className={
              inputValue
                ? "dark:bg-whatsapp-brightGreen bg-whatsapp-darkGreen text-white p-2 rounded"
                : "p-2"
            }
            onClick={() => addToInput()}
          >
            <SendHorizonalIcon
              className={inputValue ? "h-5 w-5" : "h-5 w-5 text-gray-400"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}