export class DriverNotFoundError extends Error {
    constructor(message: string = 'Driver not found') {
        super(message)
        this.name = 'DriverNotFoundError'
    }
} 