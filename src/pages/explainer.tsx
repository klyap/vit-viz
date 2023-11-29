// @ts-nocheck

import { SmallerLinkedHeatmaps } from "../components/horizontal-layout/SmallerLinkedHeatmap";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import catImgUrl1 from '../assets/vit-viz-cat/1.png';
import catImgUrl2 from '../assets/vit-viz-cat/2.png';


gsap.registerPlugin(ScrollTrigger);

export default function Scroll() {
  const main = useRef();

  useGSAP(
    () => {
      const boxes = gsap.utils.toArray("#container .w-96"),
        imgPatchContainer = document.querySelector("#img-to-patch-processing"),
        text = document.querySelector("#text"),
        container = document.querySelector("#container"),
        padding = gsap.getProperty(container, "paddingTop", "px"),
        // create a ScrollTrigger for each box that we can use to calculate snapping (we'll look at the "start" of each in the onRefresh)
        snapTriggers = boxes.map((box) => ScrollTrigger.create({
          trigger: box,
          start: "top " + padding + "px"
        })),
        snaps = []; // where we'll store the progress value for each box's ScrollTrigger (start)


      const patches = gsap.utils.toArray('.patch');

      ScrollTrigger.create({
        trigger: '#container',
        markers: true,
        pin: imgPatchContainer,
        pinSpacing: false,
        start: "top top",
        end: () => "+=" + (boxes.at(-1).getBoundingClientRect().top - boxes[0].getBoundingClientRect().top),
        onRefresh: (self) => {
          // re-populate the "snaps" Array with the progress values for where each box hits the target spot.
          const distance = self.end - self.start;
          snapTriggers.forEach((trigger, i) => snaps[i] = (trigger.start - self.start) / distance);
        },
        snap: snaps
      });

      // for swapping in the text for each section
      boxes.forEach((box, i) => {
        ScrollTrigger.create({
          trigger: box,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              // you could animate this in (fade it or whatever)
              text.innerText = "Text blurb " + (i + 1);
              // box.innerText = "hehihi";
            }
          }
        });
      });

      // // patches.forEach((box, i) => {
      // gsap.to('.patch', {
      //   // x: '+= 10',
      //   // y: '+= 10',
      //   scrollTrigger: {
      //     trigger: '#image-2',
      //     start: 'top 70%',
      //     end: 'top 50%',
      //     scrub: true,
      //     markers: { startColor: "green", endColor: "green", fontSize: "18px", fontWeight: "bold", indent: 20 },
      //     toggleActions: 'play none reverse none',
      //     invalidateOnRefresh: true,
      //     pin: imgPatchContainer
      //   },
      // });
      // // });


      // gsap.to('.grid-container', {
      //   // width: '900px',
      //   scrollTrigger: {
      //     trigger: '#image-3',
      //     start: 'top 70%',
      //     end: 'top 50%',
      //     scrub: true,
      //     markers: { startColor: "red", endColor: "red", fontSize: "18px", fontWeight: "bold", indent: 20 },
      //     toggleActions: 'play none reverse none', //  onEnter, onLeave, onEnterBack, and onLeaveBack
      //     invalidateOnRefresh: true,
      //     pin: imgPatchContainer,
      //   },
      // });

      // patches.forEach((box, i) => {
      //   gsap.to(box, {
      //     // x: i * 10,
      //     // y: 0,
      //     scrollTrigger: {
      //       trigger: '#image-3',
      //       start: 'top 70%',
      //       end: 'top 50%',
      //       scrub: true,
      //       markers: { startColor: "blue", endColor: "blue", fontSize: "18px", fontWeight: "bold", indent: 20 },
      //       toggleActions: 'play none reverse none',
      //       invalidateOnRefresh: true,
      //       pin: imgPatchContainer
      //     },
      //   });
      // });

    },
    [],
    main
  );

  return (
    <div ref={main}>
      <section className="section flex-center column">
        <h1>Basic ScrollTrigger with React</h1>
        <h2>Scroll down to see the magic happen!!!!!</h2>
      </section>

      {/* <div className="bg-green-800 text-white h-screen flex items-center justify-center">
        Some component
      </div> */}
      <div className="max-w-5xl mx-auto w-full flex py-20" id="container">
        <div className="w-1/2 space-y-16 text-white text-2xl">
          <div className="w-96 h-96 bg-red-500 p-4" id="image-1">This is an image</div>
          <div className="w-96 h-96 bg-green-500 p-4" id="image-2">{`It is split into "patches".`}</div>
          <div className="w-96 h-96 bg-blue-500 p-4" id="image-3">{`These patches are arranged into an array`}</div>
          <div className="w-96 h-96 bg-pink-500 p-4">Text blurb 14</div>

        </div>
        <div id="img-to-patch-processing">
          <p id="text">Text blurb 1</p>
          <div className="box1"></div>
          <div className="grid-container" id="patch-container" >
            {[...Array(9)].map((_, index) => (
              <img
                alt={`Image ${index + 1}`} // Provide appropriate alt text
                className="grid-item patch"
                key={index + 1}
                src={`/src/assets/vit-viz-cat/${index + 1}.png`}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
