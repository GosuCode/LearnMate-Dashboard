import type { SemesterCardProps } from "@/types/semester";

const SemesterCard = ({ semesters }: SemesterCardProps) => {
  return (
    <>
      {semesters.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p className="text-lg">No semesters yet.</p>
          <p className="text-sm">
            Start by creating one from the button above.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {semesters.map((sem) => (
            <div
              key={sem.id}
              className="rounded-2xl border p-5 shadow-md bg-background hover:shadow-lg transition"
            >
              <div className="text-lg font-semibold">{sem.name}</div>
              <div className="text-sm text-muted-foreground">{sem.code}</div>
              <div className="text-xs text-gray-500 mt-2">
                Created: {new Date(sem.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SemesterCard;
