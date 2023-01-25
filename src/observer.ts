// Observer
type Listener<EventType> = (ev: EventType) => void;
interface Observer<EventType> {
    subscribe: (listener: Listener<EventType>) => () => void;
    publish: (event: EventType) => void;
}

function createObserver<EventType>(): Observer<EventType> {
    let listeners: Listener<EventType>[] = [];

    return {
        subscribe: (listener: Listener<EventType>): () => void => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter((l) => l !== listener);
            }
        },
        publish: (event: EventType) => {
            listeners.forEach((l) => l(event));
        }
    }
}

interface BeforeSetEvent<T> {
    value: T;
    newValue: T;
}

interface AfterSetEvent<T> {
    value: T;
}

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
    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
    onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;
}

// factory function
function createDatabase<T extends BaseRecord>() {
    class InMemoryDatabase implements Database<T> {
        private db: Record<string, T> = {};

        private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
        private afterAddListeners = createObserver<AfterSetEvent<T>>();

        public set(value: T): void {
            this.beforeAddListeners.publish({
                newValue: value,
                value: this.db[value.id],
            });

            this.db[value.id] = value;

            this.afterAddListeners.publish({ value });
        }

        public get(id: string): T {
            return this.db[id];
        }

        onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
            return this.beforeAddListeners.subscribe(listener);
        }

        onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
            return this.afterAddListeners.subscribe(listener);
        }
    }

    return new InMemoryDatabase;
}

const PokemonObserverDB = createDatabase<Pokemon>();

PokemonObserverDB.onAfterAdd((obj) => {
    console.log(obj.value);
});

PokemonObserverDB.set({
    id: 'Pikachu',
    attack: 75,
    defense: 30,
});

PokemonObserverDB.set({
    id: 'Bulbasaur',
    attack: 55,
    defense: 35,
});
