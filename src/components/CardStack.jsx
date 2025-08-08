const CardStack = () => {
  return (
    <div className="stack grid perspective-[5000px] group">
      <div className="content card col-start-1 row-start-1 bg-white border-4 border-hotpink text-black p-[5vmin] text-[max(2.5vmin,.9rem)] leading-6 z-10 transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:bg-transparent group-hover:text-white group-hover:border-transparent group-hover:duration-1000 group-hover:ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:delay-0 group-hover:transform group-hover:rotate-x-45 group-hover:rotate-45 group-hover:translate-z-[75vh] group-hover:translate-y-[20vh] group-hover:translate-x-[20vh]">
        <p className="text-4xl">Appearance is A Glimpse of The Unseen</p>
        <p>Rizki Aprita</p>
        <div className="contact-popup absolute right-[-55%] top-1/2 text-base text-shadow-md whitespace-nowrap p-2 rounded-full opacity-0 text-white bg-black/70 transform rotate-[-45deg] rotate-y-45 translate-x-5 transition-opacity transition-transform duration-500 ease-in-out pointer-events-none group-hover:opacity-100 group-hover:rotate-[-45deg] group-hover:rotate-y-45 group-hover:translate-x-32 group-hover:scale-150 group-hover:transition-delay-[1.5s]">
          <p>you can contact me <br /> through this channels</p>
          <p><br /><b>Rizki Aprita</b><br />+62 812 7676 3536<br />aprita@outlook.com</p>
        </div>
      </div>
      <div className="padding card col-start-1 row-start-1 bg-transparent z-20 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] delay-100 group-hover:transform group-hover:rotate-x-45 group-hover:rotate-45 group-hover:translate-z-[50vh] group-hover:translate-y-[20vh] group-hover:translate-x-[20vh]"></div>
      <div className="border card col-start-1 row-start-1 bg-transparent z-30 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] delay-200 group-hover:transform group-hover:rotate-x-45 group-hover:rotate-45 group-hover:translate-z-[25vh] group-hover:translate-y-[20vh] group-hover:translate-x-[20vh]"></div>
      <div className="background card col-start-1 row-start-1 bg-white/5 transition-colors duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] delay-300 group-hover:bg-white group-hover:transform group-hover:rotate-x-45 group-hover:rotate-45 group-hover:translate-z-0 group-hover:translate-y-[20vh] group-hover:translate-x-[20vh]"></div>
      <div className="box-shadow card col-start-1 row-start-1 bg-transparent transition-shadow duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] delay-400 shadow-[0_2.8px_2.2px_rgba(0,0,0,0.02),0_6.7px_5.3px_rgba(0,0,0,0.028),0_12.5px_10px_rgba(0,0,0,0.035),0_22.3px_17.9px_rgba(0,0,0,0.042),0_41.8px_33.4px_rgba(0,0,0,0.05),0_100px_80px_rgba(0,0,0,0.07)] group-hover:shadow-[0_-1px_25px_rgba(0,0,0,0.4),0_7.6px_6.1px_rgba(0,0,0,0.051),0_14.3px_11.5px_rgba(0,0,0,0.059),0_25.5px_20.5px_rgba(0,0,0,0.07),0_47.6px_38.4px_rgba(0,0,0,0.094),0_114px_92px_rgba(0,0,0,0.19)] group-hover:transform group-hover:rotate-x-45 group-hover:rotate-45 group-hover:translate-z-[-25vh] group-hover:translate-y-[20vh] group-hover:translate-x-[20vh]"></div>
    </div>
  );
};

export default CardStack;