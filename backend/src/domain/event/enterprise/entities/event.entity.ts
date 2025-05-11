import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export type EventType = 'ENTRY' | 'EXIT'

export interface EventProps {
  managerId: UniqueEntityID
  driverId: UniqueEntityID
  carId: UniqueEntityID
  odometer: number
  status: EventType
  startAt: Date
  endAt?: Date
  createdAt: Date
  updatedAt?: Date
}

export class Event extends Entity<EventProps> {
  static create(props: Omit<EventProps, 'createdAt'>, id?: UniqueEntityID) {
    const now = new Date()
    const event = new Event(
      {
        ...props,
        createdAt: now,
      },
      id,
    )

    return event
  }

  get managerId() {
    return this.props.managerId
  }

  get driverId() {
    return this.props.driverId
  }

  get carId() {
    return this.props.carId
  }

  get odometer() {
    return this.props.odometer
  }

  get status() {
    return this.props.status
  }

  get startAt() {
    return this.props.startAt
  }

  get endAt() {
    return this.props.endAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  finalize(endAt: Date, odometer: number) {
    this.props.endAt = endAt
    this.props.odometer = odometer
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
