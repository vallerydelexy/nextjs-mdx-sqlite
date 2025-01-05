import LazyLoad from "react-lazyload";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import SwiperCore, {
  Pagination
} from 'swiper';

// install Swiper modules
SwiperCore.use([Pagination]);

const TestSwiper = (props) => (
  <div key={props}>
  <Swiper 
        spaceBetween={10}
        slidesPerView={"auto"}
        grabCursor={true}
        pagination={{
          "clickable": true
        }}
        onSlideChange={() => console.log('onSlideChange')}
        onSwiper={(swiper) => console.log('onSwiper')}
        breakpoints={{
          640: {
            slidesPerView: "1"
          },
          768: {
            slidesPerView: "3"
          },
        }}
        className="mySwiper"
      >
       {props.srcset.map(src => (
         <SwiperSlide key={Object.values({src})[0]}>
           <LazyLoad once>
             <img className="max-h-72 md:rounded-lg"
              src={Object.values({src})[0]}/>
         </LazyLoad>
         </SwiperSlide>
       ))} 
      </Swiper>
      </div>
)
export default TestSwiper