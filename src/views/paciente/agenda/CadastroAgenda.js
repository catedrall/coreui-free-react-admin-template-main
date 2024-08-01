import React, { useState, useRef, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import DatePicker, { registerLocale } from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import { GetPessoa } from '../../../components/Auth'
import { UrlGlobal } from '../../../GlobalUrl'
registerLocale('pt-br', ptBR)

const CadastroAgenda = () => {
  const agenda = {
    IdMedico: 0,
    IdPaciente: 0,
    DataAgendamento: new Date(),
  }

  const [paciente, setPaciente] = useState(GetPessoa())
  const [startDate, setStartDate] = useState(new Date())
  const [medicoSelecionado, setMedicoSelecionado] = useState('')
  const [nomeMedicoSelecionado, setNomeMedicoSelecionado] = useState('')
  const [horaConsulta, setHoraConsulta] = useState('')
  const [validated, setValidated] = useState(false)
  const [values, setValuesFomr] = useState(agenda)
  const [medicos, setMedicos] = useState([])
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  useEffect(() => {
    BuscaMedicos()
  }, [])

  const BuscaMedicos = async () => {
    await axios
      .get(`${UrlGlobal()}/medico/medicos`)
      .then((res) => {
        if (res.data.length == 0) {
          addToast(avisoErro)
        } else {
          setMedicos(res.data.Medicos)
        }
      })
      .catch((error) => {
        addToast(avisoErro)
      })
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      event.stopPropagation()
      EnviaDados(values)
    }
    setValidated(true)
  }

  const EnviaDados = async (values) => {
    values.DataAgendamento = startDate
    values.IdMedico = parseInt(medicoSelecionado)
    values.IdPaciente = parseInt(GetPessoa())
    console.log('consulta', values)
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
        <CToastBody>Agendamento realizado com sucesso</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const avisoErro = (
    <CToast autohide={true} color="danger" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Erro ao realizar agendamento</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const handlerFieldMedicos = (e) => {
    setMedicoSelecionado(e.target.value)
    values.IdMedico = e.target.validated
    const found = medicos.find((element) => element.Id == e.target.value)
    setNomeMedicoSelecionado('Médico ' + found.Nome)
  }

  const handlerFieldEnd = (e) => {
    setHoraConsulta(e.target.value)
    startDate.setHours(e.target.value - 3, 0, 0)
  }

  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Agenda</strong>
            </CCardHeader>
            <CCardBody>
              <CForm validated={validated} onSubmit={handleSubmit} noValidate>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="nome" className="col-sm-2 col-form-label">
                    Especialidade médica
                  </CFormLabel>
                  <CCol sm={2}>
                    <CFormSelect
                      aria-label="Default select example"
                      id="ImovelId"
                      name="ImovelId"
                      onChange={handlerFieldMedicos}
                    >
                      <option>Escolha</option>
                      {medicos.map((obj, key) => (
                        <option key={key} value={obj.Id}>
                          {obj.Especialidade}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CFormLabel htmlFor="" className="col-sm-3 col-form-label">
                    {nomeMedicoSelecionado}
                  </CFormLabel>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="dataNascimento" className="col-sm-2 col-form-label">
                    Data do agendamento
                  </CFormLabel>
                  <CCol sm={2}>
                    <div class="w-auto">
                      <DatePicker
                        locale="pt-br"
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        name="dataNascimento"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        required
                      />
                    </div>
                  </CCol>
                  <CFormLabel htmlFor="horario" className="col-sm-1 col-form-label">
                    Horário
                  </CFormLabel>
                  <CCol sm={2}>
                    <CFormSelect
                      className="form-control"
                      name="horario"
                      id="horario"
                      value={values.uf}
                      onChange={handlerFieldEnd}
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
                <CRow className="mb-3">
                  <CCol sm={2}>
                    <CButton color="primary" type="submit">
                      Agendar
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default CadastroAgenda
