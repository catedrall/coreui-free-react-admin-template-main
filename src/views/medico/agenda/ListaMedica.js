import React, { useState, useRef, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import axios from 'axios'
import { GetPessoa } from '../../../components/Auth'
import { UrlGlobal } from '../../../GlobalUrl'

const ListaMedica = () => {
  const pesquisa = {
    Id: 0,
    IdMedico: GetPessoa(),
    IdPaciente: 0,
  }

  const [agendaTela, setAgenda] = useState([])
  const [visibleModal, setVisibleModal] = useState(false)
  const [idConsulta, setIdConsulta] = useState(0)
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  useEffect(() => {
    BuscarAgenda()
    //BuscaMedicos()
  }, [])

  const BuscarAgenda = async () => {
    await axios
      .get(
        `${UrlGlobal()}/agenda/agenda?Id=` +
          pesquisa.id +
          `&IdMedico=` +
          pesquisa.IdMedico +
          `&IdPaciente=` +
          pesquisa.IdPaciente,
      )
      .then((res) => {
        if (res.data === null) {
          //addToast(avisoErro)
        } else {
          //addToast(avisoSucesso)
          let agenda = new Array()
          res.data.Agendamentos.forEach((element) => {
            let dataVeio = new Date(element.DataAgendamento)
            let consulta = {
              ConsultaId: element.Id,
              DataConsulta:
                String(dataVeio.getDate()).padStart(2, '0') +
                '/' +
                String(dataVeio.getMonth() + 1).padStart(2, '0') +
                '/' +
                dataVeio.getFullYear(),
              Paciente: element.Paciente.Nome,
              Hora: dataVeio.getHours() + ':00',
              DataAgendada: new Date(
                dataVeio.getFullYear(),
                dataVeio.getMonth(),
                dataVeio.getDate(),
              ),
            }
            agenda.push(consulta)
          })
          setAgenda(agenda)
        }
      })
      .catch((error) => {
        //addToast(avisoErro)
      })
  }

  const RemoverConsulta = async () => {
    await axios
      .delete(`${UrlGlobal()}/agenda/remover/` + idConsulta)
      .then((res) => {
        if (res.data == 'Agendamento apagado com sucesso!') {
          setVisibleModal(false)
          addToast(avisoSucesso)
          setAgenda([])
          BuscarAgenda()
        } else {
          addToast(avisoErro)
        }
      })
      .catch((error) => {
        //addToast(avisoErro)
      })
  }

  const avisoSucesso = (
    <CToast autohide={true} color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Consulta cancelada com sucesso</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const avisoErro = (
    <CToast autohide={true} color="danger" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Erro ao cancelar</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const cancelaReserva = (id) => {
    setIdConsulta(id)
    setVisibleModal(true)
  }

  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Lista de agendamentos</strong>
            </CCardHeader>
            <CCardBody>
              {/* <CTable striped columns={columns} items={agendaTela} /> */}
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Paciente</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Hora</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Opções</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {agendaTela.map((obj, ind) => (
                    <CTableRow key={ind}>
                      <CTableHeaderCell scope="row">{ind + 1}</CTableHeaderCell>
                      <CTableDataCell>{obj.Paciente}</CTableDataCell>
                      <CTableDataCell>{obj.DataConsulta}</CTableDataCell>
                      <CTableDataCell>{obj.Hora}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="danger"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() => cancelaReserva(obj.ConsultaId)}
                        >
                          Cancelar
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal scrollable visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <CModalHeader>
          <CModalTitle>Cancelar consulta</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Deseja cancelar está consulta?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => RemoverConsulta()}>
            Confirmar
          </CButton>{' '}
          <CButton color="danger" onClick={() => setVisibleModal(false)}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
export default ListaMedica
