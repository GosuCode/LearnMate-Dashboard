export type Subject = {
    id: string;
    name: string;
    code: string;
    semesterId: string;
    semester?: {
        id: string;
        name: string;
        code: string;
        createdAt: string;
    };
    createdAt: string;
    updatedAt: string;
};

export type SubjectCardProps = {
    subjects: Subject[];
}; 