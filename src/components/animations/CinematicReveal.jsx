import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CinematicReveal.css';

gsap.registerPlugin(ScrollTrigger);

const CinematicReveal = () => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const apertureRef = useRef(null);
  const mainImgWrapperRef = useRef(null);
  const mainImgRef = useRef(null);
  const sideImgLeftRef = useRef(null);
  const sideImgRightRef = useRef(null);
  const lightSweepRef = useRef(null);
  const textRef = useRef(null);
  const lensRingRef = useRef(null);

  useLayoutEffect(() => {
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1.5, // Slower, smoother scrub
        }
      });

      // 1. Initial States
      gsap.set(lensRingRef.current, { rotation: -180, opacity: 0, scale: 1.5 });
      gsap.set(apertureRef.current, { scaleX: 0, scaleY: 0.05, opacity: 0 }); // Starts as a closed slit
      gsap.set([sideImgLeftRef.current, sideImgRightRef.current], { opacity: 0, x: (i) => i === 0 ? -100 : 100 });
      gsap.set(mainImgWrapperRef.current, { scale: 0.8, opacity: 0 });
      gsap.set(mainImgRef.current, { scale: 1.3 }); // Ken Burns start
      gsap.set(lightSweepRef.current, { x: '-150%', opacity: 0 });
      gsap.set(textRef.current, { opacity: 0, y: 40 });

      // 2. The Sequence
      tl
      // The Lens Ring rotates and fades in
      .to(lensRingRef.current, { rotation: 0, opacity: 1, scale: 1, duration: 2, ease: "power2.out" })
      // The Aperture opens from a slit into a wide cinematic frame
      .to(apertureRef.current, { scaleX: 1, scaleY: 1, opacity: 1, duration: 1.5, ease: "expo.out" }, "-=1.5")
      // Film strip images slide in from the sides
      .to([sideImgLeftRef.current, sideImgRightRef.current], { opacity: 1, x: 0, duration: 1.2, ease: "back.out(1.2)" }, "-=1")
      // Main image fades in and does a subtle Ken Burns slow zoom out
      .to(mainImgWrapperRef.current, { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=0.8")
      .to(mainImgRef.current, { scale: 1, duration: 3, ease: "none" }, "-=1.5")
      // A cinematic light sweep passes over the final image
      .to(lightSweepRef.current, { x: '150%', opacity: 0.5, duration: 1.5, ease: "power1.inOut" }, "-=1")
      .to(lightSweepRef.current, { opacity: 0, duration: 0.5 })
      // Text reveals
      .to(textRef.current, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.5")
      // Stage tilts
      .to(stageRef.current, { rotateX: 8, rotateY: -4, duration: 2, ease: "none" }, "-=1");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cinematic-reveal-container" ref={containerRef}>
      
      {/* Cinematic Film Grain Texture */}
      <div className="film-grain"></div>

      <div className="animation-stage" ref={stageRef}>
        
        {/* The Rotating Lens Ring */}
        <div className="lens-ring" ref={lensRingRef}>
          <div className="ring-tick"></div>
          <div className="ring-tick"></div>
          <div className="ring-tick"></div>
          <div className="ring-tick"></div>
        </div>

        {/* The Cinematic Aperture Frame */}
        <div className="aperture-frame" ref={apertureRef}>
          <div className="aperture-line top"></div>
          <div className="aperture-line bottom"></div>
        </div>

        {/* Side Film Strip Images */}
        <div className="side-image-wrapper left">
          <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80" alt="Film 1" ref={sideImgLeftRef} />
        </div>
        <div className="side-image-wrapper right">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" alt="Film 2" ref={sideImgRightRef} />
        </div>

        {/* The Main Image */}
        <div className="main-image-wrapper" ref={mainImgWrapperRef}>
          <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80" alt="Main Center" className="main-image" ref={mainImgRef} />
          
          {/* Light Sweep Element over the image */}
          <div className="light-sweep" ref={lightSweepRef}></div>
        </div>
      </div>

      <div className="reveal-content" ref={textRef}>
        <h2>Capturing <span>Eternity</span></h2>
        <p>Every frame tells a story. Every moment is a timeless memory.</p>
      </div>
    </section>
  );
};

export default CinematicReveal;