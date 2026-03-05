export function DeliverySla() {
  const promises = [
    { title: "Response SLA", detail: "Initial response within 24 hours on business days." },
    { title: "Discovery Window", detail: "Qualified projects can begin discovery within 3-5 working days." },
    { title: "Delivery Rhythm", detail: "Weekly progress updates, milestone demos, and decision checkpoints." },
  ];

  return (
    <div className="rounded-2xl border bg-surface p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">What Happens Next</p>
      <h2 className="mt-3 text-2xl font-bold md:text-3xl">Clear timelines and communication from day one.</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {promises.map((item) => (
          <article key={item.title} className="rounded-lg border bg-white p-4">
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
