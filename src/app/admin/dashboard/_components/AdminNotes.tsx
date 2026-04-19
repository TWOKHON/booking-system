type AdminNotesProps = {
  notes: string[];
};

export const AdminNotes = ({ notes }: AdminNotesProps) => {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Admin Notes</h2>
          <p className="text-sm text-muted-foreground">
            Suggested actions to keep operations, reservations, and revenue
            aligned.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4 text-sm text-muted-foreground">
        {notes.map((note, index) => (
          <p
            key={note}
            className={
              index === 0
                ? "border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
                : "border px-4 py-3"
            }
          >
            {note}
          </p>
        ))}
      </div>
    </section>
  );
};
