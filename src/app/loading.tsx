// Loading UI durante la renderización del server component (ISR miss)
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-crema-texture">
      <div className="text-center space-y-4">
        <div
          className="text-3xl text-primary"
          style={{ fontFamily: "var(--font-dancing), cursive" }}
        >
          Pura Esencia
        </div>
        <div
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"
          role="status"
          aria-label="Cargando catálogo"
        />
      </div>
    </div>
  );
}
