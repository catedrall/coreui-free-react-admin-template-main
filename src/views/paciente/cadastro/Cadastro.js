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
import { sha384 } from 'crypto-hash'
import { GetPessoa } from '../../../components/Auth'
import { UrlGlobal } from '../../../GlobalUrl'
registerLocale('pt-br', ptBR)

const Cadastro = () => {
  const paciente = {
    Nome: '',
    Email: '',
    Nascimento: '',
    Senha: '',
    Repete: '',
  }

  const [startDate, setStartDate] = useState(new Date())
  const [validated, setValidated] = useState(false)
  const [values, setValuesFomr] = useState(paciente)
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  useEffect(() => {
    BuscaPaciente(GetPessoa())
  }, [])

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

  const getFormatedDate = (currentDate) => {
    return new Date(currentDate.split('/').reverse().join('-'))
  }

  const handlerFieldEnd = (e) => {
    let { name, value } = e.target
    setValuesFomr({
      ...values,
      [name]: value,
    })
  }

  const EnviaDados = async (values) => {
    let criptografada = await sha384(values.Senha)
    let objetoEnviar = {
      id: GetPessoa(),
      nome: values.Nome,
      email: values.Email,
      senha: criptografada,
      dataNascimento: startDate,
    }

    await axios
      .put(`${UrlGlobal()}/paciente/atualizar`, objetoEnviar)
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

  const BuscaPaciente = async (id) => {
    await axios
      .get(`${UrlGlobal()}/paciente/pacientes?Id=`+id)
      .then((res) => {
        if (res.data === null) {
          addToast(avisoErro)
        } else {
          trataColecao(res.data.Pacientes)
        }
      })
      .catch((error) => {
        addToast(avisoErro)
      })
  }

  const trataColecao = (array) => {
    let novaArray = []
    let novoPaciente = {
      Nome: '',
      Email: '',
      Nascimento: '',
      Senha: '',
      Repete: '',
    }

    array.forEach((element) => {
      novoPaciente.Email = element.Email
      novoPaciente.Nascimento = new Date(element.DataNascimento)
      novoPaciente.Nome = element.Nome
    })

    setStartDate(novoPaciente.Nascimento)
    setValuesFomr(novoPaciente)
  }

  const avisoSucesso = (
    <CToast autohide={true} color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Alteração realizada com sucesso</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const avisoErro = (
    <CToast autohide={true} color="danger" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Erro ao realizar alteração</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Alterar dados cadastrais</strong>
            </CCardHeader>
            <CCardBody>
              <CForm validated={validated} onSubmit={handleSubmit} noValidate>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="nome" className="col-sm-1 col-form-label">
                    Nome
                  </CFormLabel>
                  <CCol sm={2}>
                    <CFormInput
                      type="text"
                      id="Nome"
                      name="Nome"
                      required
                      value={values.Nome}
                      onChange={handlerFieldEnd}
                    />
                  </CCol>
                  <CFormLabel htmlFor="Email" className="col-sm-1 col-form-label">
                    E-mail
                  </CFormLabel>
                  <CCol sm={2}>
                    <CFormInput
                      type="text"
                      id="Email"
                      name="Email"
                      required
                      value={values.Email}
                      onChange={handlerFieldEnd}
                    />
                  </CCol>
                  <CFormLabel htmlFor="dataNascimento" className="col-sm-2 col-form-label">
                    Data de nascimento
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
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="senha" className="col-sm-1 col-form-label">
                    Senha
                  </CFormLabel>
                  <CCol sm={2}>
                    <CFormInput
                      type="password"
                      id="Senha"
                      name="Senha"
                      required
                      value={values.Senha}
                      onChange={handlerFieldEnd}
                    />
                  </CCol>
                  <CFormLabel htmlFor="Repete" className="col-sm-1 col-form-label">
                    Confirmar
                  </CFormLabel>
                  <CCol sm={2}>
                    <CFormInput
                      type="password"
                      id="Repete"
                      name="Repete"
                      required
                      value={values.Repete}
                      onChange={handlerFieldEnd}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol sm={2}>
                    <CButton color="primary" type="submit">
                      Alterar
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
export default Cadastro
