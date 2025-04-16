import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'

export type CarStatus = 'AVAILABLE' | 'IN_USE' | 'IN_MAINTENANCE'

export interface CarProps {
  managerId: UniqueEntityID
  brand: string
  model: string
  year: number
  color: string
  licensePlate: LicensePlate
  odometer: number
  status: CarStatus
  renavam: string
  createdAt: Date
  updatedAt?: Date
}

export class Car extends Entity<CarProps> {
  static create(props: Omit<CarProps, 'createdAt'>, id?: UniqueEntityID) {
    const now = new Date()
    const car = new Car(
      {
        ...props,
        createdAt: now,
      },
      id,
    )

    return car
  }

  get managerId() {
    return this.props.managerId
  }

  get brand() {
    return this.props.brand
  }

  get model() {
    return this.props.model
  }

  get year() {
    return this.props.year
  }

  get color() {
    return this.props.color
  }

  get licensePlate() {
    return this.props.licensePlate
  }

  get odometer() {
    return this.props.odometer
  }

  get status() {
    return this.props.status
  }

  get renavam() {
    return this.props.renavam
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  updateStatus(status: CarStatus) {
    this.props.status = status
  }

  updateOdometer(odometer: number) {
    this.props.odometer = odometer
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
