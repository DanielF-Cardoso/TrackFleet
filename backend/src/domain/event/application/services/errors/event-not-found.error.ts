export class EventNotFoundError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'EventNotFoundError'
    }
} 