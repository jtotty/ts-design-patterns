/**
 * Factory pattern.
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

// factory function
function createDatabase<T extends BaseRecord>() {
    class InMemoryDatabase implements Database<T> {
        private db: Record<string, T> = {};

        public set(value: T): void {
            this.db[value.id] = value;
        }

        public get(id: string): T {
            return this.db[id];
        }
    }

    return InMemoryDatabase;
}

const PokemonDB = createDatabase<Pokemon>();
const pokemons = new PokemonDB();

pokemons.set({
    id: 'Pikachu',
    attack: 75,
    defense: 30,
});

console.log(pokemons.get('Pikachu'));
