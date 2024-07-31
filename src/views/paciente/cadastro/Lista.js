import React, { useState, useRef, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CForm,
  CFormInput,
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
  CFormSelect,
  CFormLabel,
} from '@coreui/react'
import axios from 'axios'
import { GetPessoa } from '../../../components/Auth'
import { withMask } from 'use-mask-input'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { UrlGlobal } from '../../../GlobalUrl'

const Lista = () => {
  const pesquisa = {
    Id: 0,
    IdMedico: 0,
    IdPaciente: GetPessoa(),
  }

  const [agendaTela, setAgenda] = useState([])
  const [visibleModal, setVisibleModal] = useState(false)
  const [novaDta, setNovaDta] = useState(new Date().toLocaleDateString())
  const [visibleModalEditar, setVisibleModalEditar] = useState(false)
  const [idConsulta, setIdConsulta] = useState(0)
  const [consultaSelecionada, setConsultaSelecionada] = useState({})
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  useEffect(() => {
    BuscarAgenda()
    //BuscaMedicos()
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      DataConsulta: '',
      Hora: '',
    },
  })

  const onSubmit = () => {

    //enviaAtualizacao()
  }

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
              Especialidade: element.Medico.Especialidade,
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

  const EnviaAlteracao = async (values) => {
    values.DataAgendamento = startDate
    values.IdMedico = parseInt(medicoSelecionado)
    values.IdPaciente = GetPessoa()
    await axios
      .post(`${UrlGlobal()}/agenda/agendar`, values)
      .then((res) => {
        if (res.data === null) {
          addToast(avisoErro)
        } else {
          addToast(avisoSucesso)
        }
      })
      .catch((error) => {
        addToast(avisoErro)
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

  const avisoSucessoAlteracao = (
    <CToast autohide={true} color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Consulta alterada com sucesso</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const avisoErroAlteracao = (
    <CToast autohide={true} color="danger" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Erro ao alterar consulta</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const cancelaReserva = (id) => {
    setIdConsulta(id)
    setVisibleModal(true)
    setVisibleModalEditar(false)
  }

  const alterarConsulta = (obj) => {
    setConsultaSelecionada(obj)
    setVisibleModal(false)
    setVisibleModalEditar(true)
  }

  const handlerFieldData = (e) => {
    consultaSelecionada.Hora = e.target.value
  }

  const handlerFieldDataAlterada = (e) => {
    let novoValor = e.target.value
    setNovaDta(novoValor)
  }

  const enviaAtualizacao = async () => {
    setVisibleModalEditar(false)
    let data = novaDta.split("/")
    let enviar = {
      Id: consultaSelecionada.ConsultaId,
      NovaDataAgendamento: new Date(parseInt(data[2]), (parseInt(data[1]) - 1), data[0], 0, 0, 0, 0),
      Hora: parseInt(consultaSelecionada.Hora),
    }
    
    await axios
      .put(`${UrlGlobal()}/agenda/reagendar`, enviar)
      .then((res) => {
        if (res.data === null) {
          addToast(avisoErro)
        } else {
          addToast(avisoSucessoAlteracao)
          BuscarAgenda()
        }
      })
      .catch((error) => {
        addToast(avisoErro)
      })
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
                    <CTableHeaderCell scope="col">Especialidade</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Hora</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Opções</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {agendaTela.map((obj, ind) => (
                    <CTableRow key={ind}>
                      <CTableHeaderCell scope="row">{ind + 1}</CTableHeaderCell>
                      <CTableDataCell>{obj.Especialidade}</CTableDataCell>
                      <CTableDataCell>{obj.DataConsulta}</CTableDataCell>
                      <CTableDataCell>{obj.Hora}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          onClick={() => alterarConsulta(obj)}
                        >
                          Alterar data
                        </CButton>{' '}
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
      <CModal scrollable visible={visibleModalEditar} onClose={() => setVisibleModalEditar(false)}>
        <CModalHeader>
          <CModalTitle>Alteração</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Para alterar a data da sua consulta use o campo abaixo.</p>
          <CForm onSubmit={handleSubmit(onSubmit)}>
            <CRow className="row g-3">
              <CCol xs={6}>
              <CFormLabel htmlFor="DataConsulta">Data agendamento</CFormLabel>
              <CFormInput placeholder="" ref={withMask('99/99/9999')} value={novaDta} onChange={handlerFieldDataAlterada} />
                {/* <Controller
                  name="DataConsulta"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CFormInput
                        placeholder=""
                        {...field}
                        ref={withMask('99/99/9999')}
                      />
                    </>
                  )}
                /> */}
              </CCol>
              <CCol xs={6}>
                <CFormLabel htmlFor="numeroImovel">Horário</CFormLabel>
                <CFormSelect
                  className="form-control"
                  name="horario"
                  id="horario"
                  onChange={handlerFieldData}
                >
                  <option value="0">Escolha</option>
                  <option value="8">08:00</option>
                  <option value="9">09:00</option>
                  <option value="10">10:00</option>
                  <option value="11">11:00</option>
                  <option value="13">13:00</option>
                  <option value="14">14:00</option>
                  <option value="15">15:00</option>
                  <option value="16">16:00</option>
                  <option value="17">17:00</option>
                </CFormSelect>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => enviaAtualizacao()}>
            Confirmar
          </CButton>{' '}
          <CButton color="danger" onClick={() => setVisibleModalEditar(false)}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
export default Lista
