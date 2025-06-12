import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { LicensePlate } from '@/core/value-objects/license-plate.vo'
import { Renavam } from '@/core/value-objects/renavam.vo'

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
  renavam: Renavam
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
  inactiveAt?: Date
}

export class Car extends Entity<CarProps> {
  static create(props: Omit<CarProps, 'createdAt'>, id?: UniqueEntityID) {
    const now = new Date()
    const car = new Car(
      {
        ...props,
        createdAt: now,
        isActive: props.isActive ?? true,
        inactiveAt: props.inactiveAt ?? undefined,
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

  get isActive() {
    return this.props.isActive ?? true
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get inactiveAt() {
    return this.props.inactiveAt
  }

  updateStatus(status: CarStatus) {
    this.props.status = status
  }

  updateOdometer(odometer: number) {
    this.props.odometer = odometer
    this.touch()
  }

  updateCar(datails: {
    brand?: string
    model?: string
    year?: number
    color?: string
    odometer?: number
  }) {
    if (datails.brand !== undefined) {
      this.props.brand = datails.brand
    }
    if (datails.model !== undefined) {
      this.props.model = datails.model
    }
    if (datails.year !== undefined) {
      this.props.year = datails.year
    }
    if (datails.color !== undefined) {
      this.props.color = datails.color
    }
    if (datails.odometer !== undefined) {
      this.props.odometer = datails.odometer
    }
    this.touch()
  }

  updateLicensePlate(licensePlate: LicensePlate) {
    this.props.licensePlate = licensePlate
    this.touch()
  }

  updateRenavam(renavam: Renavam) {
    this.props.renavam = renavam
    this.touch()
  }

  inactivate() {
    this.props.isActive = false
    this.props.inactiveAt = new Date()
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
