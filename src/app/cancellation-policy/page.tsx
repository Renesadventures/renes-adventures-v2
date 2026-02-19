export default function CancellationPolicyPage() {
  return (
    <main className="bg-[#060608] text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Cancellation Policy</h1>
        <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-3xl">
          <span className="text-white/90 font-semibold">48+ hours notice:</span> free rescheduling or full refund.
          <br />
          <span className="text-white/90 font-semibold">Within 48 hours:</span> no refunds.
        </p>
      </div>
    </main>
  );
}
