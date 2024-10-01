import serverUrl from "./baseUrl"
import commonApi from "./commonApi"




export const uploadMedDetails=async(uploadMedicine)=>{
   return await commonApi("POST",`${serverUrl}/medicines`,uploadMedicine)

}
export const getAllMedicinesApi = async()=>{
   return await commonApi("GET",`${serverUrl}/medicines`,"")
}
export const deleteMedicineApi = async (id) => {
   return await commonApi("DELETE",`${serverUrl}/medicines/${id}`,"")
}
export const updateMedicineApi = async (id, updatedDetails) => {
   return await commonApi("PUT", `${serverUrl}/medicines/${id}`, updatedDetails)
}