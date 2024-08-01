import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import { SetPessoa, SetMedico, SetToken } from '../../../components/Auth'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { sha384 } from 'crypto-hash'
import { UrlGlobal } from '../../../GlobalUrl'

const Login = () => {
  const usuario = {
    Email: '',
    Senha: '',
  }
  const [validated, setValidated] = useState(false)
  const [values, setValoresFomr] = useState(usuario)
  const [aviso, setAviso] = useState('Usuário ou Senha incorretos')
  const history = useNavigate()
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const [state, setState] = useState(false)

  const carregaRegister = () => {
    history('/register')
  }

  const avisoGeral = (
    <CToast autohide={true} color="danger" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>{aviso}</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const handlerField = (e) => {
    let { name, value } = e.target
    setValoresFomr({
      ...values,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    event.preventDefault()
    setValidated(true)
    if (values.Email !== '' && values.Password !== '') {
      setState(!state)
      let rash = await sha384(values.Senha)
      values.Senha = rash
      await axios
        .post(`${UrlGlobal()}/Login`, values)
        .then((res) => {
          console.log('veio do login: ', res.data)
          setState(false)
          SetMedico(res.data.medico)
          SetPessoa(res.data.id)
          SetToken(true)
          history('/dashboard')
        })
        .catch((error) => {
          setState(false)
          addToast(avisoGeral)
          return null
        })
    }
  }
  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={handleSubmit} validated={validated} noValidate>
                      <h1>Acesso</h1>
                      <p className="text-body-secondary">Digite seus dados</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="E-mail"
                          autoComplete="E-mail"
                          name="Email"
                          onChange={handlerField}
                          required
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Senha"
                          name="Senha"
                          autoComplete="current-password"
                          onChange={handlerField}
                          required
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4" type="submit">
                            Acessar
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-right">
                          {/* <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton> */}
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Crie seu acesso</h2>
                      <p>
                        Crie seu conta para ter acesso ao nosso sistema de agendamento de consultas.
                      </p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          Paciente
                        </CButton>
                      </Link>{' '}
                      <Link to="/register-medico">
                        <CButton
                          color="primary"
                          className="mt-3"
                          href="/register-medico"
                          active
                          tabIndex={-1}
                        >
                          Médico
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
