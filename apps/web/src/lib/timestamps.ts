import {
  timestampsControllerCreate,
  timestampsControllerFindAll,
  timestampsControllerFindOne,
  timestampsControllerRemove,
  timestampsControllerUpdate,
} from '@template/api-client'
import type {
  CreateTimestampModel,
  TimestampModel,
  UpdateTimestampModel,
} from '@template/api-client'
import './api-client'

export const timestampKeys = {
  all: ['timestamps'] as const,
  detail: (id: string) => ['timestamps', id] as const,
}

export async function listTimestamps(): Promise<TimestampModel[]> {
  const { data } = await timestampsControllerFindAll({ throwOnError: true })
  return data
}

export async function getTimestamp(id: string): Promise<TimestampModel> {
  const { data } = await timestampsControllerFindOne({
    path: { id },
    throwOnError: true,
  })
  return data
}

export async function createTimestamp(
  body: CreateTimestampModel,
): Promise<TimestampModel> {
  const { data } = await timestampsControllerCreate({ body, throwOnError: true })
  return data
}

export async function updateTimestamp(
  id: string,
  body: UpdateTimestampModel,
): Promise<TimestampModel> {
  const { data } = await timestampsControllerUpdate({
    path: { id },
    body,
    throwOnError: true,
  })
  return data
}

export async function deleteTimestamp(id: string): Promise<void> {
  await timestampsControllerRemove({ path: { id }, throwOnError: true })
}

export function toDateTimeLocalValue(value: string): string {
  const date = new Date(value)
  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16)
}

export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString()
}
