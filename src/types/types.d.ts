interface Note {
    title: string;
    content: string;
    status: string
}

type WithId<T> = T & { _id: string };

interface User {
    username: string
    password: string
}

type WithEmail<T> = T & { email: string }