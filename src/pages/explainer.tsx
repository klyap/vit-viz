// @ts-nocheck

import { SmallerLinkedHeatmaps } from "../components/horizontal-layout/SmallerLinkedHeatmap";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import catImgUrl1 from '../assets/vit-viz-cat/1.png';
import catImgUrl2 from '../assets/vit-viz-cat/2.png';
import ZoomIn from '../components/explainer/zoom-in';

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
                gsap.to('#patch-container', {
                  height: '180px',
                  width: '180px'
                });
              }

              if (i === 1) {
                gsap.to('#patch-container', {
                  justifyContent: 'space-between',
                  height: '200px',
                  width: '200px'
                });
              }

              if (i === 2) {
                gsap.to('#patch-container', {
                  justifyContent: 'space-between',
                  height: '60px',
                  width: '700px'
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

  const NormalText = ({ children }) => {
    return <div className="p-4 text-2xl text-black">{children}</div>;
  };

  const H1 = ({ children }) => {
    return <div className="p-4 text-3xl text-black font-extrabold">{children}</div>;
  };

  // Function to shuffle an array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  const indices = Array.from({ length: 9 }, (_, index) => index + 1); // Create array [1, 2, 3, ..., 9]
  const shuffled = shuffleArray(indices); // Shuffle the array

  return (
    <div ref={main}>
      <section className="section flex-center column">
        <H1>A Visual Guide to Vision Transformers (ViT)</H1>
        <h2>Vision Transformer is a deep learning neural network machine learning architecture designed for image understanding and computer vision tasks like image classification.</h2>
      </section>

      {/* <div className="bg-green-800 text-white h-screen flex items-center justify-center">
        Some component
      </div> */}
      <div className="max-w-5xl mx-auto w-full flex py-20" id="container">
        <div className="w-1/2 space-y-16">
          <Text>This is an image</Text>
          <Text>{`It is split into "patches". Each patch is considered a token, the same way a word is a token in a sentence.`}</Text>
          <Text>{`These patches are arranged into an array`}</Text>
          <Text>And put through a linear projection layer to get patch embedding vectors.</Text>
        </div>
        <div className="flex flex-col" id="img-to-patch-processing">
          <p id="text">Text blurb 1</p>
          <div className="grid-container" id="patch-container" >
            {[...Array(9)].map((_, index) => (
              <div key={index + 1}>
                <img
                  alt={`Image ${index + 1}`} // Provide appropriate alt text
                  className="grid-item patch"
                  src={`/src/assets/vit-viz-cat/${index + 1}.png`}
                />

              </div>
            ))}
          </div>

        </div>

      </div>

      <div className="bg-yellow-50 h-screen flex items-center justify-center">
        <div className="flex flex-col w-80">
          <H1>CONVERTING IMAGE TO NUMBERS (FLATTENING / UNROLLING)</H1>
          <NormalText>// Use a 9 pixel drawing with easy colors and show each pixel going to number and those numbers going into a vector</NormalText>

          <NormalText>An image is made up of pixels. Each pixel has 1 color.</NormalText>
          <NormalText>
            Each color is defined by a combination of varying amounts of 3 values: <span className="text-red-500">red</span>, <span className="text-green-500">green</span>, and <span className="text-blue-500">blue</span></NormalText>

          <NormalText>For example, this pixel is </NormalText>
          <NormalText><span className="text-red-500">222</span>, <span className="text-green-500">163</span>, and <span className="text-blue-500">142</span></NormalText>
          <NormalText>We can represent each patch completely in numbers by describing the color of each pixel.</NormalText>
          <NormalText>This group of numbers is a tensor. The dimensions of the tensor for a patch is # of height pixels × # of width pixels × # of channels (which is 3 for RGB images).</NormalText>
          <NormalText>[222, 163, 142] </NormalText>
          <NormalText>[222, 163, 142] </NormalText>
          <NormalText>[222, 163, 142] </NormalText>

        </div>
        {/* <p className="w-48">We can represent an image in numbers by describing the color of each pixel. Color is represented by its red, green, and blue values</p> */}
        <img alt={`Zoomed in patch`} // Provide appropriate alt text
          className="h-72"
          src={`/src/assets/vit-viz-cat/${1}.png`}></img>
        <img alt={`Zoomed in patch`} // Provide appropriate alt text
          className="h-72"
          src={`/src/assets/color-picker-rgb.png`}></img>
      </div>

      <div className="bg-green-50 h-screen flex items-center justify-center">
        <div className="flex flex-col w-80">
          <H1>LINEAR PROJECTION</H1>
          <NormalText>In the original paper, the image is split into patches and each patch processed with linear projection. </NormalText>

          <NormalText>In practice, linear project is done using the Conv2D operation. Instead of actually splitting the image into patches, a filter (aka kernel aka convolution matrix) slides across the whole image's tensor and performs the operation at each step.</NormalText>

          <NormalText>Both linear projection and Conv2D returns a 1D vector for each patch, called patch embedding. </NormalText>
          <NormalText>Patch embeddings are a condensed representation of each patch, only capturing the most "important" characteristics about the patch like patterns, textures and edges.</NormalText>

        </div>
        {/* <p className="w-48">We can represent an image in numbers by describing the color of each pixel. Color is represented by its red, green, and blue values</p> */}
        <img alt={`Zoomed in patch`} // Provide appropriate alt text
          className="h-72"
          src={`/src/assets/truck_224.png`}></img>
        <img alt={`Zoomed in patch`} // Provide appropriate alt text
          className="h-72"
          src={`/src/assets/color-picker-rgb.png`}></img>
      </div>

      <div className="bg-purple-50 h-screen flex items-center justify-center">
        <div className="flex flex-col w-80">
          <H1>CLASSIFICATION [CLS] TOKEN </H1>
          <NormalText>A classification token/patch is appended in front of all the patch embedding vectors. The classification token is the same size as the patch embeddings.</NormalText>
          <NormalText>CLS embeddings are learned. It stores global information/features about the whole image.</NormalText>
        </div>
      </div>

      <div className="bg-green-50 h-screen flex items-center justify-center">
        <div className="flex flex-col w-80">
          <H1>POSITIONAL EMBEDDING</H1>
          <NormalText>The order of the patches matters a lot.</NormalText>
        </div>

        <div className="flex flex-col">
          <p id="text">This is a picture of a cat</p>
          <div className="grid-container">
            {[...Array(9)].map((_, index) => (
              <div key={index + 1}>
                <img
                  alt={`Image ${index + 1}`} // Provide appropriate alt text
                  className="grid-item patch"
                  src={`/src/assets/vit-viz-cat/${index + 1}.png`}
                />

              </div>
            ))}
          </div>

          <p id="text">This is NOT a picture of a cat!</p>
          <div className="grid-container">
            {shuffled.map((index) => (
              <div key={index}>
                <img
                  alt={`Image ${index}`} // Provide appropriate alt text
                  className="grid-item patch"
                  src={`/src/assets/vit-viz-cat/${index}.png`}
                />

              </div>
            ))}
          </div>

          <NormalText>The positional embedding tells the model about the ordering of the patches within an image</NormalText>
          <NormalText>Each position embedding corresponds to the position of a patch within the image, and these embeddings are added to the patch embeddings before feeding them into the transformer layers.</NormalText>
          <NormalText>This embedding is learned and added to each patch tensor.</NormalText>
        </div>
      </div>

      <div className="bg-green-50 h-screen flex items-center justify-center">
        <div className="flex flex-col w-80">
          <H1>ENCODER</H1>
          <NormalText>This consists of MLP block and multihead self attention block</NormalText>
        </div>
      </div>

      <div className="bg-green-50 h-screen flex items-center justify-center">
        <div className="flex flex-col w-80">
          <H1>CLASSIFICATION HEAD</H1>
          <NormalText>The image is then classified.</NormalText>
        </div>
      </div>

    </div>
  );
}
