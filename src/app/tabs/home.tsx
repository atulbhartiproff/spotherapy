"use client";
import TextType from "../../reactbits/TextAnimations/TextType/TextType.jsx";

export default function App() {
  return (
    <div>
      <TextType
        text={["Welcome to my website", "Something is cooking!"]}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="_"
      />
    </div>
  );
}
