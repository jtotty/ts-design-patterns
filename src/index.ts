import { RecordHandler } from './loader';

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

class InMemoryDatabase<T extends BaseRecord> implements Database<T> {
    private db: Record<string, T> = {};

    public set(value: T): void {
        this.db[value.id] = value;
    }

    public get(id: string): T {
        return this.db[id];
    }
}

const pokemonDB = new InMemoryDatabase<Pokemon>();
pokemonDB.set({
    id: 'Pikachu',
    attack: 75,
    defense: 30,
});

console.log(pokemonDB.get('Pikachu'));
