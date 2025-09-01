// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */
export abstract class EventEmitter implements IEvents {
	events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this.events = new Map<EventName, Set<Subscriber>>();
	}

	/**
	 * Установить обработчик на событие
	 */
	on<T extends object>(
		eventName: EventName,
		callback: (event: T) => void
	): void {
		if (!this.events.has(eventName)) {
			this.events.set(eventName, new Set<Subscriber>());
		}
		this.events.get(eventName)?.add(callback);
	}

	/**
	 * Снять обработчик с события
	 */
	off(eventName: EventName, callback: Subscriber): void {
		if (this.events.has(eventName)) {
			this.events.get(eventName)!.delete(callback);
			if (this.events.get(eventName)?.size === 0) {
				this.events.delete(eventName);
			}
		}
	}

	/**
	 * Инициировать событие с данными
	 */
	emit<T extends object>(eventName: string, data?: T): void {
		this.events.forEach((subscribers, name) => {
			if (name === '*')
				subscribers.forEach((callback) =>
					callback({
						eventName,
						data,
					})
				);
			if (
				(name instanceof RegExp && name.test(eventName)) ||
				name === eventName
			) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	/**
	 * Слушать все события
	 */
	onAll(callback: (event: EmitterEvent) => void): void {
		this.on('*', callback);
	}

	/**
	 * Сбросить все обработчики
	 */
	offAll(): void {
		this.events = new Map<string, Set<Subscriber>>();
	}

	/**
	 * Сделать коллбек триггер, генерирующий событие при вызове
	 */
	trigger<T extends object>(eventName: string, context?: Partial<T>): (event: object) => void {
		return (event: object = {}) => {
			this.emit(eventName, {
				...(event || {}),
				...(context || {}),
			});
		};
	}
}
