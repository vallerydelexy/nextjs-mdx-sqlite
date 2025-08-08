import React from 'react';

const CardStack = () => {
  return (
    // This wrapper mimics the original `body` styling from CodePen to center the component.
    // The `bg-zinc-800` is the default background, equivalent to lch(30 0 0).
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-800 font-sans">
      
      {/* 
        The 'group' class enables styling children based on the parent's hover state using 'group-hover:'.
        'perspective' is required for the 3D transform effect.
        The grid setup `[grid:stack]/[stack]` and `col-[stack] row-[stack]` on children 
        causes all cards to be placed in the same grid cell, stacking them on top of each other.
      */}
      <div className="stack group grid [grid:stack]/[stack] perspective-[5000px]">
        
        {/* This div simulates the fixed background from the original CSS that changes on hover. */}
        <div className="pointer-events-none fixed inset-0 bg-stone-100 transition-colors duration-[2s] ease-in-out group-hover:bg-zinc-900"></div>

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
          
          /* After pseudo-element for the label */
          after:content-['Content_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)]
          after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 
          after:transition-[opacity,transform] after:duration-500 after:ease-[ease]
          after:bg-black/70 after:text-white after:left-[-50%] after:top-[110%] max-[540px]:after:left-[-23%]
          after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)] 
          group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)]
          group-hover:after:delay-[1.5s]
        ">
          <p className="mt-0 text-[40px]">Appearance is A Glimpse of The Unseen</p>
          <p>Rizki Aprita</p>
          
          {/* Contact Pop-up */}
          <div className="
            contact-popup absolute top-1/2 right-[-55%] max-[540px]:top-[30%] max-[540px]:right-[-25%]
            p-2 rounded-[4ch] bg-black/70 text-white text-base
            text-shadow-[0_1px_3px_rgba(0,0,0,0.75)] whitespace-nowrap
            opacity-0 [transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)]
            transition-[opacity,transform] duration-500 ease-[ease] pointer-events-none
            group-hover:scale-[2] group-hover:opacity-100
            group-hover:[transform:rotate(-45deg)_rotateY(45deg)_translateX(8rem)]
            group-hover:transition-delay-[1.5s]
          ">
            <p className="m-0 leading-tight">you can contact me <br /> through this channels</p>
            <p className="m-0 leading-tight"><br/><b>Rizki Aprita</b><br/>+62 812 7676 3536<br/>aprita@outlook.com</p>
          </div>
        </div>
        
        {/* Card 2: Padding */}
        <div className="
          padding card 
          col-[stack] row-[stack] w-[40vmin] h-[40vmin] 
          landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw]
          box-border bg-transparent z-40
          transition-[transform] duration-[4s] ease-[ease] delay-[0.1s]
          group-hover:delay-[0.1s] group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)]
          group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(50vh)_translateY(20vh)_translateX(20vh)]

          /* Before pseudo-element for visual pattern */
          before:content-[''] before:absolute before:inset-0
          before:[clip-path:polygon(0%_0%,0%_100%,5vmin_100%,5vmin_5vmin,calc(100%_-_5vmin)_5vmin,calc(100%_-_5vmin)_calc(100%_-_5vmin),5vmin_calc(100%_-_5vmin),5vmin_100%,100%_100%,100%_0%)]
          before:bg-[repeating-linear-gradient(-45deg,cyan,cyan_1px,rgba(255,255,255,0.05)_1px,rgba(255,255,255,0.05)_10px)]

          /* After pseudo-element for the label */
          after:content-['Padding_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)]
          after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 
          after:transition-[opacity,transform] after:duration-500 after:ease-[ease]
          after:bg-black/70 after:text-white after:left-[-45%] after:top-[110%] max-[540px]:after:left-[-20%] max-[540px]:after:top-[70%]
          after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)] 
          group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)]
          group-hover:after:delay-[1.7s]
        "></div>
        
        {/* Card 3: Border */}
        <div className="
          border card 
          col-[stack] row-[stack] w-[40vmin] h-[40vmin]
          landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw]
          box-border bg-transparent z-30
          transition-[transform] duration-[4s] ease-[ease] delay-[0.2s]
          group-hover:delay-[0.2s] group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)]
          group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(25vh)_translateY(20vh)_translateX(20vh)]
          
          /* Before pseudo-element for visual border */
          before:content-[''] before:absolute before:inset-0
          before:[clip-path:polygon(0%_0%,0%_100%,5px_100%,5px_5px,calc(100%_-_5px)_5px,calc(100%_-_5px)_calc(100%_-_5px),5px_calc(100%_-_5px),5px_100%,100%_100%,100%_0%)]
          before:bg-pink-500

          /* After pseudo-element for the label */
          after:content-['Border_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)]
          after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 
          after:transition-[opacity,transform] after:duration-500 after:ease-[ease]
          after:bg-black/70 after:text-white after:left-[-45%] after:top-[110%] max-[540px]:after:left-[-20%] max-[540px]:after:top-[70%]
          after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)] 
          group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)]
          group-hover:after:delay-[1.9s]
        "></div>

        {/* Card 4: Background */}
        <div className="
          background card 
          col-[stack] row-[stack] w-[40vmin] h-[40vmin]
          landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw]
          box-border bg-white/5 z-20
          transition-[transform,background-color] duration-[4s] ease-[ease] delay-[0.3s]
          group-hover:delay-[0.2s] group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)]
          group-hover:bg-white
          group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(0vh)_translateY(20vh)_translateX(20vh)]

          /* After pseudo-element for the label */
          after:content-['Background_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)]
          after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 
          after:transition-[opacity,transform] after:duration-500 after:ease-[ease]
          after:bg-black/70 after:text-white after:left-[-45%] after:top-[110%] max-[540px]:after:left-[-20%] max-[540px]:after:top-[70%]
          after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)] 
          group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)]
          group-hover:after:delay-[2.1s]
        "></div>

        {/* Card 5: Box Shadow */}
        <div className="
          box-shadow card 
          col-[stack] row-[stack] w-[40vmin] h-[40vmin]
          landscape:w-[40vh] landscape:h-[40vh] max-[540px]:w-[60vw] max-[540px]:h-[60vw]
          box-border bg-transparent z-10
          shadow-[0_2.8px_2.2px_rgba(0,0,0,0.02),0_6.7px_5.3px_rgba(0,0,0,0.028),0_12.5px_10px_rgba(0,0,0,0.035),0_22.3px_17.9px_rgba(0,0,0,0.042),0_41.8px_33.4px_rgba(0,0,0,0.05),0_100px_80px_rgba(0,0,0,0.07)]
          transition-[transform,box-shadow] duration-[4s] ease-[ease] delay-[0.4s]
          group-hover:delay-[0.4s] group-hover:duration-[2s] group-hover:ease-[cubic-bezier(0.85,0,0.15,1)]
          group-hover:shadow-[0_-1px_25px_rgba(0,0,0,0.4),0_7.6px_6.1px_rgba(0,0,0,0.051),0_14.3px_11.5px_rgba(0,0,0,0.059),0_25.5px_20.5px_rgba(0,0,0,0.07),0_47.6px_38.4px_rgba(0,0,0,0.094),0_114px_92px_rgba(0,0,0,0.19)]
          group-hover:[transform:rotateX(45deg)_rotate(45deg)_translateZ(-25vh)_translateY(20vh)_translateX(20vh)]

          /* After pseudo-element for the label */
          after:content-['Shadow_Box'] after:absolute after:text-[1.25rem] after:text-shadow-[0_1px_3px_rgba(0,0,0,0.75)]
          after:whitespace-nowrap after:px-4 after:py-2 after:rounded-[4ch] after:opacity-0 
          after:transition-[opacity,transform] after:duration-500 after:ease-[ease]
          after:bg-black/70 after:text-white after:left-[-45%] after:top-[110%] max-[540px]:after:left-[-20%] max-[540px]:after:top-[70%]
          after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(20px)] 
          group-hover:after:opacity-100 group-hover:after:[transform:rotate(-45deg)_rotateY(45deg)_translateX(0px)]
          group-hover:after:delay-[2.3s]
        "></div>
      </div>
    </div>
  );
};

export default CardStack;