const faqItems = [
  {
    question: "Where should I start if I am not technical?",
    answer:
      "Start with Launch Planner or the Contact brief. We map your needs into a clear execution path and recommend the right module or service.",
  },
  {
    question: "Can I use Creator and also request done-for-you delivery?",
    answer:
      "Yes. You can generate drafts in Creator, then escalate into a managed delivery project through the contact flow when needed.",
  },
  {
    question: "How fast can we launch?",
    answer:
      "Most discovery-to-first-output flows happen within days. Full delivery timelines depend on scope, integrations, and approval cycles.",
  },
  {
    question: "Do you support ongoing optimization after launch?",
    answer:
      "Yes. We support iterative optimization, performance tuning, and process upgrades after initial delivery.",
  },
];

export function HomepageFaq() {
  return (
    <div className="rounded-2xl border bg-white p-6 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">FAQ</p>
      <h2 className="mt-3 text-2xl font-bold md:text-4xl">Answers before you start.</h2>
      <div className="mt-6 space-y-3">
        {faqItems.map((item, index) => (
          <details key={item.question} className="rounded-md border bg-surface p-4" open={index === 0}>
            <summary className="cursor-pointer text-sm font-semibold">{item.question}</summary>
            <p className="mt-2 text-sm text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
