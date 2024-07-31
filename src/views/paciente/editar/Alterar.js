import React from 'react'
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
} from '@coreui/react'

const Alterar = () => {
    return (
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Alterar dados cadastrais</strong>
              </CCardHeader>
              <CCardBody>
                <CForm>
                  <div className="row g-3">
                    <CCol md={4}>
                      <CFormInput type="text" id="nome" label="Nome" />
                    </CCol>
                    <CCol md={4}>
                      <CFormInput type="text" id="email" label="E-mail" />
                    </CCol>
                    <CCol md={4}>
                      <CFormInput type="text" id="dataNascimento" label="Data de nascimento" />
                    </CCol>
                    <CCol md={4}>
                      <CFormInput type="password" id="senha" label="Senha" />
                    </CCol>
                    <CCol md={4}>
                      <CFormInput type="password" id="senha1" label="Confirme a senha" />
                    </CCol>
                    <CCol xs={12}>
                      <CButton color="primary" type="submit">
                        Cadastrar
                      </CButton>
                    </CCol>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )
}
export default Alterar
