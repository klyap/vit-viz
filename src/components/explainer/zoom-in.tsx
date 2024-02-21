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

      console.log("padding", padding);


      const patches = gsap.utils.toArray('.patch');
      // for swapping in the text for each section

      // const containerHeight = document.querySelector('#container').clientHeight; // Get the container height
      // const elementHeight = imgPatchContainer.clientHeight; // Get the pinned element's height
      // const offset = (containerHeight - elementHeight) / 2; // Calculate the offset for centering

      ScrollTrigger.create({
        trigger: '#container',
        markers: true,
        pin: imgPatchContainer,
        pinSpacing: 'margin',
        start: "top top",
        end: () => "+=" + (boxes.at(-1).getBoundingClientRect().top - boxes[0].getBoundingClientRect().top),
        onRefresh: (self) => {
          // re-populate the "snaps" Array with the progress values for where each box hits the target spot.
          const distance = self.end - self.start;
          snapTriggers.forEach((trigger, i) => snaps[i] = (trigger.start - self.start) / distance);
        },
        snap: snaps
      });

      boxes.forEach((box, i) => {
        ScrollTrigger.create({
          trigger: box,
          start: "top center",
          end: "bottom center",
          toggleActions: 'play none reverse none',
          markers: true,
          onUpdate: (self) => {
            // Calculate the opacity based on the scroll position
            const opacity = 1 - self.progress;

            // Apply the calculated opacity to the text element
            gsap.to(box, { opacity });
          },
          onToggle: (self) => {
            if (self.isActive) {
              // you could animate this in (fade it or whatever)
              text.innerText = "Text blurb " + (i + 1);
              // box.innerText = "hehihi";
              if (i === 0) {
                gsap.to('.grid-container', {
                  height: '300px',
                  width: '300px'
                });
              }

              if (i === 1) {
                gsap.to('.grid-container', {
                  justifyContent: 'space-between',
                  height: '330px',
                  width: '330px'
                });
              }

              if (i === 2) {
                gsap.to('.grid-container', {
                  justifyContent: 'space-between',
                  height: '100px',
                  width: '990px'
                });
              }

            }
          }
        });
      });

    },
    [],
    main
  );

  const Text = ({ children }) => {
    return <div className="w-96 h-96 p-4 text-2xl opacity-0">{children}</div>;
  };

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
        <div className="w-1/2 space-y-16">
          <Text>This is an image</Text>
          <Text>{`It is split into "patches".`}</Text>
          <Text>{`These patches are arranged into an array`}</Text>
          <Text>And put through linear projection. LINEAR PROJECTION condenses the numbers we have describing the image into an even smaller number of numbers</Text>

        </div>
        <div className="flex flex-col items-center" id="img-to-patch-processing">
          <p id="text">Text blurb 1</p>
          <div className="grid-container" id="patch-container" >
            {[...Array(9)].map((_, index) => (
              <div key={index + 1}>
                <img
                  alt={`Image ${index + 1}`} // Provide appropriate alt text
                  className="grid-item patch"
                  src={`/assets/vit-viz-cat/${index + 1}.png`}
                />

              </div>
            ))}
          </div>

          <img alt={`Zoomed in patch`} // Provide appropriate alt text
            className="h-72"
            src={`/assets/vit-viz-cat/${1}.png`}></img>
        </div>
      </div>


    </div>
  );
}
