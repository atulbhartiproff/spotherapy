"use client";
import TextType from "../../reactbits/TextAnimations/TextType/TextType.jsx";
import LightRays from "../../blocks/Backgrounds/LightRays/LightRays.jsx";

export default function App() {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#FFFFFF"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1 }}>
        <TextType
          text={["Welcome to my website", "Something is cooking!"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="_"
          variableSpeed={false}
          onSentenceComplete={() => {}}
        />
      </div>
    </div>
  );
}
