import { faker } from '@faker-js/faker'

export const mockData = {
  createStore: (override = {}) => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    created_at: faker.date.recent().toISOString(),
    ...override
  }),

  createTopping: (override = {}) => ({
    id: faker.string.uuid(),
    store_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    created_at: faker.date.recent().toISOString(),
    ...override
  }),

  createPizza: (override = {}) => ({
    id: faker.string.uuid(),
    store_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    created_by: faker.string.uuid(),
    created_at: faker.date.recent().toISOString(),
    ...override
  })
}

export const mockResponses = {
  success: (data: any) => ({ data, error: null }),
  error: (message: string) => ({ data: null, error: new Error(message) })
}