export type Todo = {
    id: number;
    title: string;
    completed: boolean;
    userId: number;
}

export type TodoState = {
    todos: Todo[];
    loading: boolean;
    error: string | null;
}


export type TodoAction = {
    type: 'ADD_TODO';
    payload: Todo;
} | {
    type: 'DELETE_TODO';
    payload: number;
}
