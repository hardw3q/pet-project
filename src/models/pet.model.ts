export interface Pet{
    id:     number;
    name:   string;
    age:    number;
    health: number;
    hunger: number;
    mood:   number;
    status: 'alive' | 'sick' | 'dead';
}