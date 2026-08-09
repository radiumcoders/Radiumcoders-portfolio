import { AsciiObject } from "@/components/canvasui/AsciiObject"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl items-center px-6">
      <div className="aspect-square w-full">
        <AsciiObject
          src="/logo.jpg"
          ascii
          colored
          cellSize={10}
          cellAspect={0.6}
          contrast={1.5}
          edgeContrast={3}
          exposure={1}
          highlight="#066aff"
          environmentIntensity={1}
          roughness={0.15}
          scale={3}
          floatIntensity={2}
          rotationIntensity={1}
          floatSpeed={2}
          fov={65}
          cameraDistance={4.2}
          className="h-full w-full"
        />
      </div>
    </main>
  )
}
