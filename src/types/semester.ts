export type Semester = {
    id: string;
    name: string;
    code: string;
    createdAt: string;
};

export type SemesterCardProps = {
    semesters: Semester[];
};