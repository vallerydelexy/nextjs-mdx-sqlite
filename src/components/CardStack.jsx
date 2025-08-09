'use client';

import React from 'react';

const CardStack = () => {
  return (
    <div tabIndex="0" className="stack group grid [grid:stack]/[stack] perspective-[5000px] peer z-10 outline-none focus:pt-[30vh] md:pt-0">
      
      {/* Card 1: Content */}
      <div className="
        content card 
        col-[stack] row-[stack] w-[40vmin] h-[40vmin]
        landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw]
        box-border p-[5vmin] bg-white border-[5px] border-pink-500 text-black 
        text-[max(2.5vmin,_.9rem)] leading-snug z-50
        transition-[transform,color,background-color,border-color] duration-[4s] ease-[ease]
        group-hover:delay-0 group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)]
        group-hover:bg-transparent group-hover:text-white group-hover:border-transparent
        group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(75vh)_translateY(20vh)_translateX(20vh)]
        group-focus:delay-0 group-focus:duration-[2s] group-focus:ease-[cubic-bezier(0.85,0,0.15,1)]
        group-focus:bg-transparent group-focus:text-white group-focus:border-transparent
        group-focus:[transform:rotateX(45deg)_rotate(45deg)_translateZ(75vh)_translateY(20vh)_translateX(20vh)]
        
        /* After pseudo-element for the label */
        after:content-['Content_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)]
        after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 
        after:transition-[opacity,transform] after:duration-500 after:ease-[ease]
        after:bg-black/70 after:text-white after:left-[-50%] after:top-[110%] max-[540px]:after:left-[-23%]
        after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)] 
        group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-hover:after:delay-[1.5s]
        group-focus:after:opacity-100 group-focus:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-focus:after:delay-[1.5s]
      ">
        <p className="mt-0 md:text-5xl text-3xl">Appearance is A Glimpse of The Unseen</p>
        <p className='pt-8 md:text-sm font-bold text-sm'>Rizki Aprita</p>
        
        {/* Contact Pop-up */}
        <div className="
          contact-popup absolute top-1/4 right-[-85%] max-[540px]:top-[30%] max-[540px]:right-[-25%]
          p-4 rounded-[4ch] bg-black/70 text-white text-base
          text-shadow-[0_1px_3px_rgba(0,0,0,0.75)] whitespace-nowrap
          opacity-0 [transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)]
          transition-[opacity,transform] duration-250 ease-[ease] pointer-events-none
          group-hover:scale-[2] group-hover:opacity-100 group-hover:[transform:rotate(-45deg)_rotateY(45deg)_translateX(8rem)] group-hover:transition-delay-[1.5s]
          group-focus:scale-[2] group-focus:opacity-100 group-focus:[transform:rotate(-45deg)_rotateY(45deg)_translateX(8rem)] group-focus:transition-delay-[1.5s]
        ">
          <p className="m-0 leading-tight text-xl">you can contact me <br /> through this channels</p>
          <p className="m-0 leading-tight text-xl"><br/><b>Rizki Aprita</b><br/>+62 812 7676 3536<br/>aprita@outlook.com</p>
        </div>
      </div>
      
      {/* Other Cards: Added group-focus for mobile tap */}
      <div className="
        padding card col-[stack] row-[stack] w-[40vmin] h-[40vmin] landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw] box-border bg-transparent z-40 transition-[transform] duration-[4s] ease-[ease] delay-[0.1s]
        group-hover:delay-[0.1s] group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(50vh)_translateY(20vh)_translateX(20vh)]
        group-focus:delay-[0.1s] group-focus:duration-[2s] group-focus:ease-[cubic-bezier(0.85,0,0.15,1)] group-focus:[transform:rotateX(45deg)_rotate(45deg)_translateZ(50vh)_translateY(20vh)_translateX(20vh)]
        before:content-[''] before:absolute before:inset-0 before:[clip-path:polygon(0%_0%,0%_100%,5vmin_100%,5vmin_5vmin,calc(100%_-_5vmin)_5vmin,calc(100%_-_5vmin)_calc(100%_-_5vmin),5vmin_calc(100%_-_5vmin),5vmin_100%,100%_100%,100%_0%)] before:bg-[repeating-linear-gradient(-45deg,cyan,cyan_1px,rgba(255,255,255,0.05)_1px,rgba(255,255,255,0.05)_10px)]
        after:content-['Padding_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)] after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 after:transition-[opacity,transform] after:duration-250 after:ease-[ease] after:bg-black/70 after:text-white after:left-[-45%] after:top-[110%] max-[540px]:after:left-[-20%] max-[540px]:after:top-[70%] after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)] 
        group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-hover:after:delay-[1.7s]
        group-focus:after:opacity-100 group-focus:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-focus:after:delay-[1.7s]
      "></div>
      
      <div className="
        border card col-[stack] row-[stack] w-[40vmin] h-[40vmin] landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw] box-border bg-transparent z-30 transition-[transform] duration-[4s] ease-[ease] delay-[0.2s]
        group-hover:delay-[0.2s] group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(25vh)_translateY(20vh)_translateX(20vh)]
        group-focus:delay-[0.2s] group-focus:duration-[2s] group-focus:ease-[cubic-bezier(0.85,0,0.15,1)] group-focus:[transform:rotateX(45deg)_rotate(45deg)_translateZ(25vh)_translateY(20vh)_translateX(20vh)]
        before:content-[''] before:absolute before:inset-0 before:[clip-path:polygon(0%_0%,0%_100%,5px_100%,5px_5px,calc(100%_-_5px)_5px,calc(100%_-_5px)_calc(100%_-_5px),5px_calc(100%_-_5px),5px_100%,100%_100%,100%_0%)] before:bg-pink-500
        after:content-['Border_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)] after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 after:transition-[opacity,transform] after:duration-250 after:ease-[ease] after:bg-black/70 after:text-white after:left-[-45%] after:top-[110%] max-[540px]:after:left-[-20%] max-[540px]:after:top-[70%] after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)]
        group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-hover:after:delay-[1.9s]
        group-focus:after:opacity-100 group-focus:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-focus:after:delay-[1.9s]  
      "></div>

      <div className="
        background card col-[stack] row-[stack] w-[40vmin] h-[40vmin] landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw] box-border bg-white/5 z-20 transition-[transform,background-color] duration-[4s] ease-[ease] delay-[0.3s]
        group-hover:delay-[0.2s] group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:bg-white group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(0vh)_translateY(20vh)_translateX(20vh)]
        group-focus:delay-[0.2s] group-focus:duration-[2s] group-focus:ease-[cubic-bezier(0.85,0,0.15,1)] group-focus:bg-white group-focus:[transform:rotateX(45deg)_rotate(45deg)_translateZ(0vh)_translateY(20vh)_translateX(20vh)]
        after:content-['Background_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)] after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 after:transition-[opacity,transform] after:duration-250 after:ease-[ease] after:bg-black/70 after:text-white after:left-[-45%] after:top-[110%] max-[540px]:after:left-[-20%] max-[540px]:after:top-[70%] after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)]
        group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-hover:after:delay-[2.1s]
        group-focus:after:opacity-100 group-focus:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-focus:after:delay-[2.1s]
      "></div>

      <div className="
        box-shadow card col-[stack] row-[stack] w-[40vmin] h-[40vmin] landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw] box-border bg-transparent z-10 shadow-[0_2.8px_2.2px_rgba(0,0,0,0.02),0_6.7px_5.3px_rgba(0,0,0,0.028),0_12.5px_10px_rgba(0,0,0,0.035),0_22.3px_17.9px_rgba(0,0,0,0.042),0_41.8px_33.4px_rgba(0,0,0,0.05),0_100px_80px_rgba(0,0,0,0.07)] transition-[transform,box-shadow] duration-[4s] ease-[ease] delay-[0.4s]
        group-hover:delay-[0.4s] group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:shadow-[0_-1px_25px_rgba(0,0,0,0.4),_...] group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(-25vh)_translateY(20vh)_translateX(20vh)]
        group-focus:delay-[0.4s] group-focus:duration-[2s] group-focus:ease-[cubic-bezier(0.85,0,0.15,1)] group-focus:shadow-[0_-1px_25px_rgba(0,0,0,0.4),_...] group-focus:[transform:rotateX(45deg)_rotate(45deg)_translateZ(-25vh)_translateY(20vh)_translateX(20vh)]
        after:content-['Shadow_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)] after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 after:transition-[opacity,transform] after:duration-250 after:ease-[ease] after:bg-black/70 after:text-white after:left-[-45%] after:top-[110%] max-[540px]:after:left-[-20%] max-[540px]:after:top-[70%] after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)]
        group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-hover:after:delay-[2.3s]
        group-focus:after:opacity-100 group-focus:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)] group-focus:after:delay-[2.3s]
      "></div>
    </div>
  );
};

export default CardStack;