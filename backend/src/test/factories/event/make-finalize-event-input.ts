import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface MakeFinalizeEventInputProps {
    eventId?: string
    odometer?: number
}

export function makeFinalizeEventInput({
    eventId = new UniqueEntityID().toValue(),
    odometer = 1000,
}: MakeFinalizeEventInputProps = {}) {
    return {
        eventId,
        odometer,
    }
} 