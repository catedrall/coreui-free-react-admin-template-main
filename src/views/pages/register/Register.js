import React, { useState, useRef  } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
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
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilBirthdayCake } from '@coreui/icons'
import { withMask } from 'use-mask-input'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { parse, isDate } from 'date-fns'
import axios from 'axios'
import { sha384 } from 'crypto-hash'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const history = useNavigate()
  const [formData, setFormData] = useState({
    Nome: '',
    Email: '',
    Nascimento: '',
    Senha: '',
  })

  const [erros, setErros] = useState({
    Nome: '',
    Email: '',
    Nascimento: '',
    Senha: '',
  })

  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const getFormatedDate = (currentDate) => {
    return new Date(currentDate.split('/').reverse().join('-'))
  }

  const schema = yup.object().shape({
    Nome: yup.string().required('Campo obrigatório!'),
    Email: yup.string().email('Email em formato inválido!').required('Campo obrigatório!'),
    Nascimento: yup.string().required('Campo obrigatório!'),
    Senha: yup.string().required('Senha obrigatória'),
    Repete: yup
      .string()
      .oneOf([yup.ref('Senha'), null], 'As senhas devem corresponder')
      .required('Campo obrigatório!'),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Nome: '',
      Email: '',
      Nascimento: '',
      Senha: '',
      Repete: '',
    },
  })

  const onSubmit = (data) => {
    EnviaDados(data)
  }

  const EnviaDados = async (values) => {
    let criptografada = await sha384(values.Senha)
    let objetoEnviar = {
      nome: values.Nome,
      email: values.Email,
      senha: criptografada,
      dataNascimento: getFormatedDate(values.Nascimento),
    }

    //`https://localhost:44356/api/Endereco/`, values
    await axios
      .post(`https://localhost:44390/api/paciente/criar`, objetoEnviar)
      .then((res) => {
        if (res.data === null) {
          addToast(avisoErro)
        } else {
          addToast(avisoSucesso)
          history('/login')
        }
      })
      .catch((error) => {
        console.log('Erro')
      })
  }

  const avisoSucesso = (
    <CToast autohide={true} color="success" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Cadastro realizado com sucesso</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  const avisoErro = (
    <CToast autohide={true} color="danger" className="text-white align-items-center">
      <div className="d-flex">
        <CToastBody>Erro ao realizar cadastro</CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  )

  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Cadastro</h1>
                    <p className="text-body-secondary">Faça seu cadastro</p>
                    <span style={{ color: 'red' }}>{errors.Nome?.message}</span>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <Controller
                        name="Nome"
                        control={control}
                        render={({ field }) => (
                          <>
                            <CFormInput placeholder="Nome" {...field} />
                          </>
                        )}
                      />
                    </CInputGroup>
                    <span style={{ color: 'red' }}>{errors.Nascimento?.message}</span>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilBirthdayCake} />
                      </CInputGroupText>
                      <Controller
                        name="Nascimento"
                        control={control}
                        render={({ field }) => (
                          <>
                            <CFormInput
                              placeholder="Data de nascimento"
                              {...field}
                              ref={withMask('99/99/9999')}
                            />
                          </>
                        )}
                      />
                    </CInputGroup>
                    <span style={{ color: 'red' }}>{errors.Email?.message}</span>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <Controller
                        name="Email"
                        control={control}
                        render={({ field }) => (
                          <>
                            <CFormInput placeholder="E-mail" {...field} />
                          </>
                        )}
                      />
                    </CInputGroup>
                    <span style={{ color: 'red' }}>{errors.Senha?.message}</span>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <Controller
                        name="Senha"
                        control={control}
                        render={({ field }) => (
                          <>
                            <CFormInput type="password" placeholder="Senha" {...field} />
                          </>
                        )}
                      />
                    </CInputGroup>
                    <span style={{ color: 'red' }}>{errors.Repete?.message}</span>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <Controller
                        name="Repete"
                        control={control}
                        render={({ field }) => (
                          <>
                            <CFormInput type="password" placeholder="Repetir senha" {...field} />
                          </>
                        )}
                      />
                    </CInputGroup>
                    <div className="d-grid">
                      <CButton color="success" type="submit">
                        Criar cadastro
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Register
