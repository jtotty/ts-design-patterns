/**
 * Singleton pattern.
 */

interface Pokemon {
    id: string;
    attack: number;
    defense: number;
}

interface BaseRecord {
    id: string;
}

interface Database<T extends BaseRecord> {
    set(value: T): void;
    get(id: string): T | undefined;
}

class InMemoryDatabase<T extends Pokemon> implements Database<T> {
    private db: Record<string, T> = {};

    static instance = new InMemoryDatabase();

    private constructor() {}

    public set(value: T): void {
        this.db[value.id] = value;
    }

    public get(id: string): T {
        return this.db[id];
    }
}

const PokemonDBSingleton = InMemoryDatabase.instance;

PokemonDBSingleton.set({
    id: 'Pikachu',
    attack: 75,
    defense: 30,
});

console.log(PokemonDBSingleton.get('Pikachu'));
