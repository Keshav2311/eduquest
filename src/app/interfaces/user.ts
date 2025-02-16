export interface UserInterface {
    id: String,
    name: String,
    email: String
    gender: String,
    role: String,
    experience: Number,
    password: String
    courses?: String[],
    active: boolean
};
