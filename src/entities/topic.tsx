interface Topic {
    id: number;
    comment: string;
    description: string;
    lecturer: {
        id?: number;
    };
    name: string;
    note: string;
    quantityGroupMax: number;
    requireInput: string;
    standradOutput: string;
    status: string;
    target: string;
    term: {
        id: number;
    };
}
export default Topic;
