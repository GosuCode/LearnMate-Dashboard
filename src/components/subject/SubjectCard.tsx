import type { SubjectCardProps } from "@/types/subject";

const SubjectCard = ({ subjects }: SubjectCardProps) => {
  return (
    <>
      {subjects.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p className="text-lg">No subjects yet.</p>
          <p className="text-sm">
            Start by creating one from the button above.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="rounded-2xl border p-5 shadow-md bg-background hover:shadow-lg transition"
            >
              <div className="text-lg font-semibold">{subject.name}</div>
              <div className="text-sm text-muted-foreground">
                {subject.code}
              </div>
              {subject.semester && (
                <div className="text-xs text-blue-600 mt-1">
                  Semester: {subject.semester.name} ({subject.semester.code})
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Created: {new Date(subject.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SubjectCard;
