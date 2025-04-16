import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Address } from "@/core/value-objects/address.vo";
import { Email } from "@/core/value-objects/email.vo";
import { Name } from "@/core/value-objects/name.vo";

export type CnhType = 'A' | 'B' | 'C' | 'D' | 'E'

export interface DriverProps {
    name: Name
    cnh: string
    cnhType: CnhType
    email: Email
    phone: string
    address: Address
    createdAt: Date
    updatedAt?: Date
}

export class Driver extends Entity<DriverProps> {
    static create(props: Omit<DriverProps, 'createdAt'>, id?: UniqueEntityID) {
        const now = new Date()
        const driver = new Driver(
            {
                ...props,
                createdAt: now,
                updatedAt: now,
            },
            id,
        )
        return driver
    }

    get name() {
        return this.props.name
    }

    get cnh() {
        return this.props.cnh
    }

    get cnhType() {
        return this.props.cnhType
    }

    get email() {
        return this.props.email
    }

    get phone() {
        return this.props.phone
    }

    get address() {
        return this.props.address
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    updatePhonenumber(newPhone: string) {
        this.props.phone = newPhone
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }
}