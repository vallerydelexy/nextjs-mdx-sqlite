"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const messages = [
  "Hai saya Rizki, \nSaya membuat website, aplikasi android dan ios yang mudah dipahami dan digunakan",
  "bikin software desktop juga bisa kok, tapi lebih sering bikin website & app sih hehe",
  "kalo pengen tanya tanya atau diskusi, klik tombol whatsapp ya..",
  { src: "/images/oke.webp", alt: "oke patrick" },
];

function TypingBubble() {
  return (
    <div className="mt-4 flex justify-center animate-fade-in">
      <div className="w-[32rem] rounded px-3 py-2 bg-gray-100 dark:bg-gray-800">
        <p className="text-whatsapp-darkGreen dark:text-whatsapp-brightGreen font-semibold text-sm">
          Rizki Aprita
        </p>
        <div className="mt-1 flex items-center gap-1 py-1">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ msg }) {
  const isImage = typeof msg === "object" && msg.src;
  const currentDate = new Date();

  return (
    <div className="mt-4 flex justify-center animate-fade-in">
      <div className="w-[32rem] rounded px-3 py-2 bg-gray-100 dark:bg-gray-800">
        <p className="text-whatsapp-darkGreen dark:text-whatsapp-brightGreen font-semibold text-sm">
          Rizki Aprita
        </p>
        {isImage ? (
          <div className="mt-1 relative">
            <Image
              src={msg.src}
              alt={msg.alt}
              width={120}
              height={120}
              className="rounded object-cover w-24 h-24"
            />
            <p className="text-gray-500 mt-1 text-right text-xs">
              {currentDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
              })}
            </p>
          </div>
        ) : (
          <>
            <p className="mt-1 text-sm whitespace-pre-line">{msg}</p>
            <p className="text-gray-500 mt-1 text-right text-xs">
              {currentDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
              })}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Greeting() {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const currentIndex = useRef(0);

  useEffect(() => {
    function showNext() {
      if (currentIndex.current >= messages.length) return;
      setIsTyping(true);
      setTimeout(() => {
        const msgToAdd = messages[currentIndex.current];
        setIsTyping(false);
        setVisibleMessages((prev) => [...prev, msgToAdd]);
        currentIndex.current += 1;
        if (currentIndex.current < messages.length) {
          setTimeout(showNext, 800);
        }
      }, 1500);
    }
    const initialDelay = setTimeout(showNext, 500);
    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <>
      {visibleMessages.map((msg, i) => (
        <ChatBubble key={i} msg={msg} />
      ))}
      {isTyping && <TypingBubble />}
    </>
  );
}
