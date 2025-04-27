import { InMemoryCarRepository } from 'test/repositories/in-memory-car.repository'
import { UpdateCarService } from './update-car.service'
import { I18nService } from 'nestjs-i18n'
import { CarNotFoundError } from './errors/car-not-found'
import { CarAlreadyExistsError } from './errors/car-already-exists-error'
import { makeCar } from 'test/factories/car/make-car'
import { FakeLogger } from 'test/fake/logs-mocks'

let sut: UpdateCarService
let carRepository: InMemoryCarRepository
let i18n: I18nService
let logger: FakeLogger

beforeEach(() => {
  carRepository = new InMemoryCarRepository()
  i18n = { translate: vi.fn() } as unknown as I18nService
  logger = new FakeLogger()

  sut = new UpdateCarService(carRepository, i18n, logger)
})

describe('UpdateCarService', () => {
  it('should update all provided fields successfully', async () => {
    const car = makeCar()
    await carRepository.create(car)

    const newLicensePlate = 'NEW1234'
    const newRenavam = '98765432109'

    const result = await sut.execute({
      carId: car.id.toString(),
      licensePlate: newLicensePlate,
      renavam: newRenavam,
      brand: 'NewBrand',
      model: 'NewModel',
      year: 2030,
      color: 'Red',
      odometer: 50000,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      const updated = result.value.findedCar
      expect(updated.id.toString()).toBe(car.id.toString())
      expect(updated.licensePlate.toValue()).toBe(newLicensePlate)
      expect(updated.renavam.toValue()).toBe(newRenavam)
      expect(updated.brand).toBe('NewBrand')
      expect(updated.model).toBe('NewModel')
      expect(updated.year).toBe(2030)
      expect(updated.color).toBe('Red')
      expect(updated.odometer).toBe(50000)
    }
  })

  it('should return CarNotFoundError when the car does not exist', async () => {
    vi.spyOn(i18n, 'translate').mockResolvedValue('Car not found.')

    const result = await sut.execute({ carId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CarNotFoundError)
    if (result.value instanceof CarNotFoundError) {
      expect(result.value.message).toBe('Car not found.')
    }
  })

  it('should not allow duplicate license plate', async () => {
    const car1 = makeCar({ licensePlate: 'AAA1111' })
    const car2 = makeCar({ licensePlate: 'BBB2222' })
    await carRepository.create(car1)
    await carRepository.create(car2)

    vi.spyOn(i18n, 'translate').mockResolvedValue(
      'License plate already exists.',
    )

    const result = await sut.execute({
      carId: car2.id.toString(),
      licensePlate: car1.licensePlate.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CarAlreadyExistsError)
    if (result.value instanceof CarAlreadyExistsError) {
      expect(result.value.message).toBe('License plate already exists.')
    }
  })

  it('should not allow duplicate renavam', async () => {
    const car1 = makeCar({ renavam: '11111111111' })
    const car2 = makeCar({ renavam: '22222222222' })
    await carRepository.create(car1)
    await carRepository.create(car2)

    vi.spyOn(i18n, 'translate').mockResolvedValue('Renavam already exists.')

    const result = await sut.execute({
      carId: car2.id.toString(),
      renavam: car1.renavam.toValue(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CarAlreadyExistsError)
    if (result.value instanceof CarAlreadyExistsError) {
      expect(result.value.message).toBe('Renavam already exists.')
    }
  })
})
