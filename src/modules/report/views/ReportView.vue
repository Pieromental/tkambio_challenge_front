<template>
  <div class="report-table-container">
    <ReportTable :propReporte="dataReport"></ReportTable>
  </div>
  <div class="report-table-button">
    <ReportButton
      :prop-class="'report-button-view'"
      :prop-title="'Crear reporte'"
      @actionModal="showModal = true"
    />
  </div>
  <ReportModal v-if="showModal" @closeModal="closeModal" />
</template>
<script lang="ts" setup>
/****************************************************************************/
/*                             IMPORTS                                      */
/****************************************************************************/
import { onMounted, ref } from 'vue'
import { useLoader } from '@/composable/loader/useLoader'
import { useAlert } from '@/composable/alert/useAlert'
import { useFetchHttp } from '@/composable/fetch/useFetchHttp'
import ReportTable from '../components/ReportTable.vue'
import ReportModal from '../components/ReportModal.vue'
import ReportButton from '../components/ReportButton.vue'
import { resources } from '../api/ReportResource'
import Echo from '@/plugin/echoPlugin'
/****************************************************************************/
/*                             COMPOSABLES                                    */
/****************************************************************************/
const { fetchHttpResource } = useFetchHttp()
const { showLoader, hideLoader } = useLoader()
const { showAlert } = useAlert()

/****************************************************************************/
/*                             DATA                                       */
/****************************************************************************/
const dataReport = ref<any>([])
const showModal = ref(false)

/****************************************************************************/
/*                             METHODS                                       */
/****************************************************************************/

const listReport = async () => {
  try {
    showLoader()
    const response: any = await fetchHttpResource(resources.listReport, true)
    hideLoader()

    if (response.status) {
      dataReport.value = response.data
    } else {
      await showAlert({
        type: 'error',
        title: response.title,
        message: response.message,
      })
    }
  } catch (error) {
    console.log(error)
  }
}
const startWebSocket = () => {
  try {
    Echo.channel('reports').listen('.generated', (data: any) => {
      if (!data || !data.report_id) {
        console.warn('⚠️ Report ID no disponible:', data)
        return
      }
      dataReport.value = [data, ...dataReport.value]
    })
  } catch (error) {
    console.log('❌ Error al iniciar WebSocket:', error)
  }
}
const closeModal = async () => {
  showModal.value = false
}
/****************************************************************************/
/*                             LYFECICLE                                     */
/****************************************************************************/
onMounted(async () => {
  await listReport()
  startWebSocket()
})
</script>
<style scoped lang="sass">
.report-table-container
  width: 100%
  margin: 0 auto
  border-radious:5px

.report-table-button
  display: flex
  justify-content: center
  align-items: center
  width: 100%

.report-button-view
  margin-top: 30px
  background-color: rgb(255, 190, 18)
  color: black
  padding: 1rem 3rem
  border: none
  border-radius: 25px
  cursor: pointer
  font-size: 20px
  font-weight: 700
  &:hover
    background-color: rgba(255, 192, 18, 0.725)
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3)

@media (max-width: 1024px)
  .report-button-view
    font-size: 20px

@media (max-width: 768px)
  .report-button-view
    font-size: 18px

@media (max-width: 425px)
  .report-button-view
    font-size: 16px
</style>
