import { findAllResidents, findResidentByExactMatch, createResidentRecord, createHousehold, findResidentById, updateResidentRecord } from '../repositories/resident.repository'
import { ResidentInput } from 'src/lib/validations/resident.schema'

export async function getResidents() {
  return await findAllResidents()
}

export async function getResidentProfile(id: string) {
  return await findResidentById(id)
}

export async function createResident(data: ResidentInput) {
  // Check for duplicates
  const existing = await findResidentByExactMatch(data.firstName, data.lastName, new Date(data.birthDate))
  if (existing) {
    throw new Error('Duplicate resident: A resident with the same name and birth date already exists.')
  }

  // Handle household setup
  let householdId = data.householdId
  
  if (!householdId) {
    const newHousehold = await createHousehold({
      houseNumber: data.houseNumber,
      street: data.street,
      sitio: data.sitio,
      purok: data.purok,
      barangay: data.barangay || 'Default Barangay'
    })
    householdId = newHousehold.id
  }

  return await createResidentRecord(data, householdId)
}

export async function updateResident(id: string, data: ResidentInput) {
  // Check if updating to an already existing duplicate resident name (other than self)
  const existing = await findResidentByExactMatch(data.firstName, data.lastName, new Date(data.birthDate))
  if (existing && existing.id !== id) {
    throw new Error('Duplicate resident: Another resident with the same name and birth date already exists.')
  }

  // Handle household setup
  let householdId = data.householdId
  
  if (!householdId) {
    const newHousehold = await createHousehold({
      houseNumber: data.houseNumber,
      street: data.street,
      sitio: data.sitio,
      purok: data.purok,
      barangay: data.barangay || 'Default Barangay'
    })
    householdId = newHousehold.id
  }

  return await updateResidentRecord(id, data, householdId)
}
